package com.example.androidhive;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.apache.http.NameValuePair;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.app.ListActivity;
import android.os.AsyncTask;
import android.os.Bundle;
import android.app.ProgressDialog;
import android.content.Intent;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.TextView;
import android.widget.AdapterView.OnItemClickListener;

public class All_Tests extends ListActivity {

	    // Progress Dialog
		private ProgressDialog pDialog;

		// Criar o objecto JSON Parser
		JSONParser jParser = new JSONParser();

		//Array list de testes
		ArrayList<HashMap<String, String>> testsList;

		// URL do Servidor //////////////////////////////////////////////////////////////
		private static String url_all_products = "http://192.168.1.3:8080/testList"; ////
        ////////////////////////////////////////////////////////////////////////////////
		// JSON Nome dos campos
		private static final String TAG_SUCCESS = "success";
		private static final String TAG_PRODUCTS = "tests";
		private static final String TAG_PID = "id";
		private static final String TAG_TITLE = "title";
		private static final String TAG_TEXT = "text";
		private static final String TAG_MAX_TRIES = "maxTries";
		
		//Products JSONArray
		JSONArray products = null;

		@Override
		public void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			setContentView(R.layout.activity_all__tests);

			// Hashmap para ListView
			testsList = new ArrayList<HashMap<String, String>>();

			// Load Tests em Background Thread
			new LoadAllProducts().execute();

			// Get listview
			ListView lv = getListView();

			// Ao Clickar num Item da lista
			// Abre a janela de MoreInfo
			lv.setOnItemClickListener(new OnItemClickListener() {
				@Override
				public void onItemClick(AdapterView<?> parent, View view,
						int position, long id) {
					
					////Vai Buscar as TextView Ocultas Informação///
					String title = ((TextView) view.findViewById(R.id.title)).getText()
							.toString();
					String text = ((TextView) view.findViewById(R.id.text)).getText()
							.toString();
					String tries = ((TextView) view.findViewById(R.id.tries)).getText()
							.toString();
					
					
					Intent i = new Intent(getApplicationContext(), ViewMoreInfo.class);
					// Insere um  Extra, coloca duas variaveis para serem enviadas para a janela MoreInfo
					i.putExtra(TAG_TITLE, title);
					i.putExtra(TAG_TEXT, text);
					i.putExtra(TAG_MAX_TRIES, tries);
					startActivity(i);
				}
			});

		}

		// Response from Edit Product Activity
		@Override
		protected void onActivityResult(int requestCode, int resultCode, Intent data) {
			super.onActivityResult(requestCode, resultCode, data);
			// if result code 100
			if (resultCode == 100) {
				// if result code 100 is received 
				// means user edited/deleted product
				// reload this screen again
				Intent intent = getIntent();
				finish();
				startActivity(intent);
			}

		}

		/**
		 * Background Async Task para carregar todos os Testes por HTTP Request
		 * */
		class LoadAllProducts extends AsyncTask<String, String, String> {

			/**
			 * Before starting background thread Show Progress Dialog
			 * */
			@Override
			protected void onPreExecute() {
				super.onPreExecute();
				pDialog = new ProgressDialog(All_Tests.this);
				pDialog.setMessage("Loading Tests. Please wait...");
				pDialog.setIndeterminate(false);
				pDialog.setCancelable(false);
				pDialog.show();
			}

			/**
			 * getting All products from url
			 * */
			protected String doInBackground(String... args) {
				// Construi os Parametros
				List<NameValuePair> params = new ArrayList<NameValuePair>();
				// getting JSON string from URL
				JSONObject json = jParser.makeHttpRequest(url_all_products, "GET", params);
				
				// Check your log cat for JSON reponse
				Log.d("All Tests: ", json.toString());

				try {
					// Checking for SUCCESS TAG
					int success = json.getInt(TAG_SUCCESS);

					if (success == 1) {
						// products found
						// Getting Array of Products
						products = json.getJSONArray(TAG_PRODUCTS);

						// looping through All Products
						for (int i = 0; i < products.length(); i++) {
							JSONObject c = products.getJSONObject(i);

							// Storing each json item in variable
							String id = c.getString(TAG_PID);
							String title = c.getString(TAG_TITLE);
							String text = c.getString(TAG_TEXT);
							String tries = c.getString(TAG_MAX_TRIES);

							// creating new HashMap
							HashMap<String, String> map = new HashMap<String, String>();

							// adding each child node to HashMap key => value
							map.put(TAG_PID, id);
							map.put(TAG_TITLE, title);
							map.put(TAG_TEXT, text);
							map.put(TAG_MAX_TRIES, tries);
							
							// adding HashList to ArrayList
							testsList.add(map);
						}
					} else {
						// no products found
						// Launch Add New product Activity
						Intent i = new Intent(getApplicationContext(),
								Send_ResultTest.class);
						// Closing all previous activities
						i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
						startActivity(i);
					}
				} catch (JSONException e) {
					e.printStackTrace();
				}

				return null;
			}

			/**
			 * After completing background task Dismiss the progress dialog
			 * **/
			protected void onPostExecute(String file_url) {
				// dismiss the dialog after getting all products
				pDialog.dismiss();
				// updating UI from Background Thread
				runOnUiThread(new Runnable() {
					public void run() {
						/**
						 * Updating parsed JSON data into ListView
						 * */
						ListAdapter adapter = new SimpleAdapter(
								All_Tests.this, testsList,
								R.layout.list_item, new String[] { TAG_PID,
										TAG_TITLE, TAG_TEXT, TAG_MAX_TRIES},
								new int[] { R.id.id, R.id.title, R.id.text, R.id.tries});
						// updating listview
						setListAdapter(adapter);
					}
				});

			}

		}
    
}
