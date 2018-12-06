package com.example.zero.texteditor;

import android.app.Activity;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class SigninActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signin);
    }

    public void showMessage(String message) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show();
    }

    public Activity getActivity(){
        return this;
    }


    public void onClickBtnSignin() {
        EditText txtUsername = (EditText) findViewById(R.id.txtUsername_s);
        EditText txtPassword = (EditText) findViewById(R.id.txtPassword_s);
        EditText txtName = (EditText) findViewById(R.id.txtName_s);
        EditText txtLastName = (EditText) findViewById(R.id.txtLastName_s);
        EditText txtEmail = (EditText) findViewById(R.id.txtEmail_s);

        String url = "http://carloscupe.pythonanywhere.com/mobile_signin";
        RequestQueue queue = Volley.newRequestQueue(this);

        Map<String, String> params = new HashMap();
        params.put("username", txtUsername.getText().toString());
        params.put("password", txtPassword.getText().toString());
        params.put("first_name", txtName.getText().toString());
        params.put("last_name", txtLastName.getText().toString());
        params.put("email", txtEmail.getText().toString());


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
                                Intent intent = new Intent(getActivity(), WelcomeActivity.class);
                                startActivity(intent);
                                finish();
                            } else {
                                showMessage("Server Error");
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
