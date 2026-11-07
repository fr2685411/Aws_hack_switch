package org.wemakedevs.switch

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.firestore.Firestore
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.cloud.FirestoreClient
import kotlinx.coroutines.tasks.await
import java.io.File
import java.io.FileInputStream

object FirebaseService {
    private val firestore: Firestore by lazy {
        initFirebase()
        FirestoreClient.getFirestore()
    }

    private fun initFirebase() {
        if (FirebaseApp.getApps().isNotEmpty()) return

        val credentialsPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        val optionsBuilder = FirebaseOptions.builder()

        if (!credentialsPath.isNullOrBlank() && File(credentialsPath).exists()) {
            FileInputStream(credentialsPath).use { serviceAccount ->
                optionsBuilder.setCredentials(GoogleCredentials.fromStream(serviceAccount))
            }
        } else {
            // Fallback to default application credentials or emulator
            optionsBuilder.setCredentials(GoogleCredentials.getApplicationDefault())
        }

        FirebaseApp.initializeApp(optionsBuilder.build())
    }

    suspend fun recordEvent(
        eventId: String,
        author: String,
        problem: String,
        channelId: String
    ) {
        val payload = mapOf(
            "eventId" to eventId,
            "author" to author,
            "problem" to problem,
            "channelId" to channelId,
            "status" to "PENDING_APPROVAL",
            "category" to "[Bug]",
            "createdAt" to com.google.firebase.Timestamp.now()
        )
        firestore.collection("workspace_events").document(eventId).set(payload).await()
    }

    suspend fun approveAndExecute(
        eventId: String,
        approvedBy: String
    ): Boolean {
        return try {
            firestore.collection("workspace_events").document(eventId).update(
                mapOf(
                    "status" to "APPROVED_AND_EXECUTED",
                    "approvedBy" to approvedBy,
                    "executedAt" to com.google.firebase.Timestamp.now()
                )
            ).await()
            true
        } catch (e: Exception) {
            System.err.println("Firestore update failed: ${e.message}")
            false
        }
    }
}
