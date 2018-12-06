package com.example.zero.texteditor;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class DocumentActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener {

    RecyclerView mRecyclerView;
    RecyclerView.Adapter mAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


        //final String userEmail = getIntent().getExtras().get("user_email").toString();

        //final String user_email = getIntent().getExtras().get("email").toString();
        //TextView email_view = (TextView) findViewById(R.id.textView);
        //email_view.setText(user_email);

        setContentView(R.layout.activity_document);


        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setPopUp();
            }

        });

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.addDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        mRecyclerView = findViewById(R.id.main_recycler_view);
        setTitle("Documents");
    }

    public void setPopUp() {
        LinearLayout popUp_layout = (LinearLayout) findViewById(R.id.llt_PopUp);
        popUp_layout.setVisibility(View.VISIBLE);
    }

    public void onClickNewDoc(View v) {
        String url = "http://carloscupe.pythonanywhere.com/mobile_document";

        EditText txtDocName = (EditText) findViewById(R.id.txtDocName);
        final String userId = getIntent().getExtras().get("user_id").toString();

        RequestQueue queue = Volley.newRequestQueue(this);
        Map<String, String> params = new HashMap();
        params.put("recipient", txtDocName.getText().toString());
        params.put("user_id", userId);


        JSONObject parameters = new JSONObject(params);
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(
                Request.Method.POST,
                url,
                parameters,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        finish();
                        startActivity(getIntent());
                    }
                }, new Response.ErrorListener() {

            @Override
            public void onErrorResponse(VolleyError error) {
                // TODO: Handle error
                error.printStackTrace();

            }
        });
        queue.add(jsonObjectRequest);

        LinearLayout popUp_layout = (LinearLayout) findViewById(R.id.llt_PopUp);
        popUp_layout.setVisibility(View.INVISIBLE);
    }

    public void onClickAddDoc(View v) {
        String url = "http://carloscupe.pythonanywhere.com/mobile_document_user";

        EditText txtDocName = (EditText) findViewById(R.id.txtDocName);

        RequestQueue queue = Volley.newRequestQueue(this);
        Map<String, String> params = new HashMap();
        params.put("document_id", txtDocName.getText().toString());

        final String userId = getIntent().getExtras().get("user_id").toString();

        JSONObject parameters = new JSONObject(params);
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(
                Request.Method.PUT,
                url,
                parameters,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONArray data = response.getJSONArray("data");
                            mAdapter = new DocumentAdapter(data, getActivity(), userId);
                            mRecyclerView.setAdapter(mAdapter);

                        }catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {

            @Override
            public void onErrorResponse(VolleyError error) {
                // TODO: Handle error
                error.printStackTrace();

            }
        });
        queue.add(jsonObjectRequest);

        LinearLayout popUp_layout = (LinearLayout) findViewById(R.id.llt_PopUp);
        popUp_layout.setVisibility(View.INVISIBLE);
    }

    public Activity getActivity(){
        return this;
    }

    @Override
    protected void onResume(){
        super.onResume();
        mRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        getDocuments();
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.document, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        int id = item.getItemId();

        if(id == R.id.nav_camera) {
            logoutClk();
        }


        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);

        return true;
    }


    public void logoutClk() {
        String url = "http://carloscupe.pythonanywhere.com/mobile_logout";
        RequestQueue queue = Volley.newRequestQueue(this);

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(
                Request.Method.GET,
                url,
                null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONArray data = response.getJSONArray("data");
                            Intent intent = new Intent(DocumentActivity.this, WelcomeActivity.class);
                            startActivity(intent);
                            finish();

                        }catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {

            @Override
            public void onErrorResponse(VolleyError error) {
                // TODO: Handle error
                error.printStackTrace();

            }
        });
        queue.add(jsonObjectRequest);

    }


    public void getDocuments(){
        final String userId = getIntent().getExtras().get("user_id").toString();
        String url = "http://carloscupe.pythonanywhere.com/mobile_document_user/";
        url = url + userId;

        RequestQueue queue = Volley.newRequestQueue(this);

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(
                Request.Method.GET,
                url,
                null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONArray data = response.getJSONArray("data");
                            mAdapter = new DocumentAdapter(data, getActivity(), userId);
                            mRecyclerView.setAdapter(mAdapter);

                        }catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {

            @Override
            public void onErrorResponse(VolleyError error) {
                // TODO: Handle error
                error.printStackTrace();

            }
        });
        queue.add(jsonObjectRequest);

    }
}
/*




    public void getDocuments(){
        String url = "http://10.0.2.2:8080/users";
        RequestQueue queue = Volley.newRequestQueue(this);
        Map<String, String> params = new HashMap();
        JSONObject parameters = new JSONObject(params);
        final String userId = getIntent().getExtras().get("user_id").toString();
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(
                Request.Method.GET,
                url,
                parameters,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONArray data = response.getJSONArray("data");
                            mAdapter = new DocumentAdapter(data, getActivity(), userId);
                            mRecyclerView.setAdapter(mAdapter);

                        }catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {

            @Override
            public void onErrorResponse(VolleyError error) {
                // TODO: Handle error
                error.printStackTrace();

            }
        });
        queue.add(jsonObjectRequest);

    }
*/