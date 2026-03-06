#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(FileExportModule, NSObject)

RCT_EXTERN_METHOD(exportLog:(NSString *)logData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
