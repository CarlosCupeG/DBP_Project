package com.example.zero.texteditor;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.LinearLayout;

public class WelcomeActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);



        setContentView(R.layout.activity_welcome);
    }

    public void loginClick(View v) {
        Intent intent = new Intent(WelcomeActivity.this, LoginActivity.class);
        startActivity(intent);

    }

    public void singinClick(View v) {
        Intent intent = new Intent(WelcomeActivity.this, SigninActivity.class);
        startActivity(intent);
    }


}
