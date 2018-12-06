package com.example.zero.texteditor;

import android.app.Activity;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static android.Manifest.permission.READ_CONTACTS;


public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
    }

    public void showMessage(String message) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show();
    }

    public Activity getActivity(){
        return this;
    }

    public void onClickBtnLogin(View v) {
        EditText txtUsername = (EditText) findViewById(R.id.txtUsername);
        EditText txtPassword = (EditText) findViewById(R.id.txtPassword);

        String url = "http://carloscupe.pythonanywhere.com/mobile_login";
        RequestQueue queue = Volley.newRequestQueue(this);

        Map<String, String> params = new HashMap();
        params.put("username", txtUsername.getText().toString());
        params.put("password", txtPassword.getText().toString());

        JSONObject parameters = new JSONObject(params);
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(
                Request.Method.POST,
                url,
                parameters,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        //TODO
                        try {
                            boolean ok = response.getBoolean("response");
                            if(ok) {
                                Intent intent = new Intent(getActivity(), DocumentActivity.class);
                                intent.putExtra("user_id", response.getInt("id"));
                                intent.putExtra("user_email", response.getString("email"));
                                startActivity(intent);
                                finish();
                            } else {
                                showMessage("Wrong username or password");
                            }

                            showMessage(response.toString());
                        }catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {

            @Override
            public void onErrorResponse(VolleyError error) {
                // TODO: Handle error
                error.printStackTrace();
                showMessage(error.getMessage());
            }
        });
        queue.add(jsonObjectRequest);
    }
}
