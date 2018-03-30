package com.thecatnative;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    @Override
    protected void onStart() {
        super.onStart();
        setTheme(R.style.AppTheme);
    }

    @Override
    protected void onStop() {
        super.onStop();
        setTheme(R.style.AppTheme_Splash);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "thecatnative";
    }
}
