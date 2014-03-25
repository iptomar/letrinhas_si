package com.example.androidhive;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;


public class MainScreenActivity extends Activity{
	
	Button btnViewProducts;
	Button btnNewProduct;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main_screen);
		
		// Buttons
		btnViewProducts = (Button) findViewById(R.id.btnViewProducts);
		btnNewProduct = (Button) findViewById(R.id.btnSendResult);
		// view products click event
		btnViewProducts.setOnClickListener(new View.OnClickListener() {
			
			@Override
			public void onClick(View view) {
				// Launching All products Activity

			 	Intent i = new Intent(getApplicationContext(), All_Tests.class);
			 	//Enviar IP para outra janela
			 	i.putExtra("IP", ((TextView) findViewById(R.id.txtBoxIpServer)).getText()
						.toString());
			 	startActivity(i);
			}
		});
		
		
		
		// view products click event
		btnNewProduct.setOnClickListener(new View.OnClickListener() {
			
			@Override
			public void onClick(View view) {
				// Launching create new product activity
				Intent i = new Intent(getApplicationContext(), Send_ResultTest.class);
				i.putExtra("IP", ((TextView) findViewById(R.id.txtBoxIpServer)).getText()
						.toString());
				startActivity(i);
				
			}
		});
	}
	
	 
}
