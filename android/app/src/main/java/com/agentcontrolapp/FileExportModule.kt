package com.agentcontrolapp

import android.os.Environment
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.*

class FileExportModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "FileExportModule"
    }

    @ReactMethod
    fun exportLog(logData: String, promise: Promise) {
        try {
            // Get the documents directory (external storage)
            val documentsDir = reactApplicationContext.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS)

            if (documentsDir == null) {
                promise.reject("FILE_EXPORT_ERROR", "Could not access documents directory")
                return
            }

            // Create filename with timestamp
            val dateFormat = SimpleDateFormat("yyyy-MM-dd_HH-mm-ss", Locale.getDefault())
            val timestamp = dateFormat.format(Date())
            val filename = "agent-activity-log_$timestamp.txt"

            // Create file
            val file = File(documentsDir, filename)

            // Write data to file using native file APIs
            FileOutputStream(file).use { outputStream ->
                outputStream.write(logData.toByteArray())
            }

            // Resolve with the file path
            promise.resolve(file.absolutePath)
        } catch (e: Exception) {
            promise.reject("FILE_EXPORT_ERROR", "Failed to export log: ${e.localizedMessage}", e)
        }
    }
}
