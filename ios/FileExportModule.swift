import Foundation
import React

@objc(FileExportModule)
class FileExportModule: NSObject {

  @objc
  func exportLog(_ logData: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) -> Void {
    do {
      // Get the documents directory path
      let documentsPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]

      // Create filename with timestamp
      let dateFormatter = DateFormatter()
      dateFormatter.dateFormat = "yyyy-MM-dd_HH-mm-ss"
      let timestamp = dateFormatter.string(from: Date())
      let filename = "agent-activity-log_\(timestamp).txt"

      // Full file path
      let filePath = documentsPath.appendingPathComponent(filename)

      // Write data to file using native file APIs
      try logData.write(to: filePath, atomically: true, encoding: .utf8)

      // Resolve with the file path
      resolver(filePath.path)
    } catch {
      rejecter("FILE_EXPORT_ERROR", "Failed to export log: \(error.localizedDescription)", error)
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
