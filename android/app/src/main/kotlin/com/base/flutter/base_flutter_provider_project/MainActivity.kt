package com.nextrip.app

import android.os.Bundle
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.android.FlutterFragmentActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import android.content.pm.PackageManager

class MainActivity : FlutterFragmentActivity() {
    private val API_KEY_CHANNEL = "api_key_channel"
    private lateinit var methodChannel: MethodChannel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        methodChannel = MethodChannel(
            flutterEngine.dartExecutor.binaryMessenger,
            API_KEY_CHANNEL
        )

        methodChannel.setMethodCallHandler { call, result ->
            when (call.method) {
                "setApiKey" -> {
                    val apiKey = call.argument<String>("apiKey")
                    apiKey?.let { updateManifestApiKey(it) }
                    result.success(null)
                }
                else -> result.notImplemented()
            }
        }
    }

    private fun updateManifestApiKey(apiKey: String) {
        try {
            val applicationInfo = packageManager.getApplicationInfo(
                packageName,
                PackageManager.GET_META_DATA
            )

            applicationInfo.metaData.putString(
                "com.google.android.geo.API_KEY",
                apiKey
            )
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}