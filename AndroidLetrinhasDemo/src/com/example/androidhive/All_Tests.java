package com.example.androidhive;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.apache.http.NameValuePair;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.AlertDialog;
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

		// URL do Servidor  Nota: Recebido em baixo//////////////////////////////////////////////////////////////
		private static String url_all_tests= ""; ////
        ////////////////////////////////////////////////////////////////////////////////
		// JSON Nome dos campos
		private static final String TAG_SUCCESS = "success";
		private static final String TAG_TESTS= "tests";
		private static final String TAG_PID = "id";
		private static final String TAG_TITLE = "title";
		private static final String TAG_TEXT = "text";
		private static final String TAG_MAX_TRIES = "maxTries";
		
		//Products JSONArray
		JSONArray tests = null;

		@Override
		public void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			setContentView(R.layout.activity_all__tests);

			// Obtendo Detalhes dos Testes do intent
			Intent i = getIntent();
			
	    	// Obtendo CAMPO IP e PORTA enviados para esta Janela
			String ip = i.getStringExtra("IP");
			String porta = i.getStringExtra("PORTA");
			url_all_tests = "http://"+ip+":"+porta+"/testList"; 
			
			
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
					
					////Vai Buscar as TextView Ocultas na list_item ///
					String title = ((TextView) view.findViewById(R.id.title)).getText()
							.toString();
					String text = ((TextView) view.findViewById(R.id.text)).getText()
							.toString();
					String tries = ((TextView) view.findViewById(R.id.tries)).getText()
							.toString();
					
					
					Intent i = new Intent(getApplicationContext(), ViewMoreInfo.class);
					// Insere um  Extra, coloca variaveis para serem enviadas para a janela ViewMoreInfo
					i.putExtra(TAG_TITLE, title);
					i.putExtra(TAG_TEXT, text);
					i.putExtra(TAG_MAX_TRIES, tries);
					startActivity(i);
				}
			});

		}

		// Resposta 
		

		/**
		 * Background Async Task para carregar todos os Testes por HTTP Request
		 * */
		class LoadAllProducts extends AsyncTask<String, String, String> {

			/**
			 * Antes de iniciar a Thread Bacground aparece a progress Dialog
			 * */
			@Override
			protected void onPreExecute() {
				super.onPreExecute();
				pDialog = new ProgressDialog(All_Tests.this);
				pDialog.setMessage("A Carregar Testes. Por Favor aguarde...");
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
				JSONObject json = jParser.Get(url_all_tests, params);
				
				try {
					// verifica a Tag SUCCESS, usada para verificar de a mensagem chegou a nós como deve ser
					int success = json.getInt(TAG_SUCCESS);

					if (success == 1) {
						// Testes encontrados
						// Obtendo um Array de todos os Tests
						tests = json.getJSONArray(TAG_TESTS);

						// For (loop)looping atraves de todos os Testes
						for (int i = 0; i < tests.length(); i++) {
							JSONObject c = tests.getJSONObject(i);
							
							// Armazenar cada item json nas variáveis
							String id = c.getString(TAG_PID);
							String title = c.getString(TAG_TITLE);
							String text = c.getString(TAG_TEXT);
							String tries = c.getString(TAG_MAX_TRIES);

							// Criar um novo HashMap
							HashMap<String, String> map = new HashMap<String, String>();

							// Adicionar cada NODE filho ao HashMap chave => valor
							map.put(TAG_PID, id);
							map.put(TAG_TITLE, title);
							map.put(TAG_TEXT, text);
							map.put(TAG_MAX_TRIES, tries);
							
							// Acrescentando HashList para ArrayList
							testsList.add(map);
						}
					} else {
						// Sem testes Encontrados
						AlertDialog.Builder alertDialog = new AlertDialog.Builder(All_Tests.this);	       
						alertDialog.setMessage("Sem Registos");
				        alertDialog.show();
					}
				} catch (JSONException e) {
					e.printStackTrace();
				}
				return null;
			}

			/**
			 * Depois de completar tarefa de background Fechar a Progress Dialog
			 * **/
			protected void onPostExecute(String file_url) {
				//fechar a janela de Progress Dialog depois de receber todos os Tests
				pDialog.dismiss();
				// Actualizar a UI a partir da Background Thread
				runOnUiThread(new Runnable() {
					public void run() {
						/**
						 * Inserir parsed JSON para dentro da ListView
						 * */
						ListAdapter adapter = new SimpleAdapter(
								All_Tests.this, testsList,
								R.layout.list_item, new String[] { TAG_PID, TAG_TITLE, TAG_TEXT, TAG_MAX_TRIES},
								new int[] { R.id.id, R.id.title, R.id.text, R.id.tries});
						// actualizar listview
						setListAdapter(adapter);
					}
				});

			}

		}
    
}
