import UIKit
import Flutter
import FirebaseCore
import GoogleMaps
import app_links

@main
@objc class AppDelegate: FlutterAppDelegate {
    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        // Configure Firebase first
        FirebaseApp.configure()
        
        // Provide Google Maps API key
        GMSServices.provideAPIKey("AIzaSyCgX8fVnxc1Kajx4nNrGsgfdaws59A3Gk4")
        
        // Register Flutter plugins
        GeneratedPluginRegistrant.register(with: self)
        
        // Handle app links
        if let url = AppLinks.shared.getLink(launchOptions: launchOptions) {
            AppLinks.shared.handleLink(url: url)
        }
        
        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }
}
