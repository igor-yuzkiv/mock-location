package com.rn_mock_location_provider;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

import com.facebook.react.bridge.Promise;

import android.location.Location;
import android.location.LocationManager;
import android.location.LocationListener;
import android.content.Context;
import android.location.provider.ProviderProperties;
import android.os.Build;
import android.os.SystemClock;
import android.util.Log;

import com.facebook.react.bridge.ReadableMap;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;


public class MockLocationModule extends ReactContextBaseJavaModule {
    MockLocationModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "MockLocationModule";
    }

    @RequiresApi(api = Build.VERSION_CODES.S)
    @ReactMethod
    public void setMockLocation(ReadableMap data, Promise promise) {
        try {
            Log.i("MockLocationModule", data.toString());
            LocationManager locationManager = (LocationManager) getReactApplicationContext().getSystemService(Context.LOCATION_SERVICE);

            locationManager.addTestProvider(LocationManager.GPS_PROVIDER,
                    false, // requiresNetwork
                    false, // requiresSatellite
                    false, // requiresCell
                    false, // hasMonetaryCost
                    true, // supportsAltitude
                    false, // supportsSpeed
                    true, // supportsBearing
                    ProviderProperties.POWER_USAGE_LOW,
                    ProviderProperties.ACCURACY_FINE);


            Location newLocation = new Location(LocationManager.GPS_PROVIDER);

            newLocation.setLatitude(data.getDouble("latitude"));
            newLocation.setLongitude(data.getDouble("longitude"));
            newLocation.setAccuracy(20);
            newLocation.setAltitude(0);

            if (data.hasKey("heading")) {
                newLocation.setBearing((float) data.getDouble("heading"));
            } else {
                newLocation.setBearing(12);
            }

            newLocation.setTime(System.currentTimeMillis());
            newLocation.setElapsedRealtimeNanos(SystemClock.elapsedRealtimeNanos());

            locationManager.setTestProviderLocation(LocationManager.GPS_PROVIDER, newLocation);

            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("Create Event Error", e);
        }
    }
}
