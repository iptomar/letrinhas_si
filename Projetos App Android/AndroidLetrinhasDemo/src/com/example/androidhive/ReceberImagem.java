package com.example.androidhive;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.http.NameValuePair;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.example.androidhive.Send_ResultTest.SendResult;

import android.os.AsyncTask;
import android.os.Bundle;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ListAdapter;
import android.widget.SimpleAdapter;
import android.widget.TextView;

public class ReceberImagem extends Activity {

	private ProgressDialog pDialog;
	private static String url_all_tests= ""; ////
	byte[] arrayBytesImage ;
	String title;
	
	// Criar o objecto JSON Parser
			JSONParser jParser = new JSONParser();
	// JSON Nome dos campos
			private static final String TAG_SUCCESS = "success";
			private static final String TAG_TESTS= "tests2";
			private static final String TAG_PID = "id";
			private static final String TAG_TITLE = "title";
			private static final String TAG_IMG = "imagem";
			JSONArray tests = null;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_receber_imagem);
		
					// Obtendo Detalhes dos Testes do intent
					Intent i = getIntent();
			    	// Obtendo CAMPO IP e PORTA enviados para esta Janela
					String ip = i.getStringExtra("IP");
					String porta = i.getStringExtra("PORTA");
					url_all_tests = "http://"+ip+":"+porta+"/testRecImg"; 
		
				// Buttons
				Button btnReceberImg = (Button) findViewById(R.id.btnReceberImg);
				// view products click event
				btnReceberImg.setOnClickListener(new View.OnClickListener() {
					@Override
					public void onClick(View view) {
					new ReceberImg().execute();
					}
				});
	}
	
	
	class ReceberImg extends AsyncTask<String, String, String> {
		protected static final String LETRINHAS_APP_TAG = "letrinhas-app";

		/**
		 * Antes de iniciar a Thread Bacground aparece a progress Dialog
		 * */
		@Override
		protected void onPreExecute() {
			super.onPreExecute();
			pDialog = new ProgressDialog(ReceberImagem.this);
			pDialog.setMessage("A Carregar Imagem. Por Favor aguarde...");
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
					JSONObject c = tests.getJSONObject(0);
					// Armazenar cada item json nas variáveis
					String id = c.getString(TAG_PID);
					title = c.getString(TAG_TITLE);
					String text = c.getString(TAG_IMG);
			
					arrayBytesImage =	Base64.decode(text, Base64.DEFAULT);
						//Log.d(LETRINHAS_APP_TAG, String.format("Title: %s", text));
				} else {
					// Sem testes Encontrados
					AlertDialog.Builder alertDialog = new AlertDialog.Builder(ReceberImagem.this);	       
					alertDialog.setMessage("Sem Registos");
			        alertDialog.show();
				}
			} catch (Exception e) {
				Log.e(LETRINHAS_APP_TAG, "WTF no JSON");
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
					
					Bitmap bmp = BitmapFactory.decodeByteArray(arrayBytesImage, 0, arrayBytesImage.length);
					// Acede aos objectos da janela e preenche com informação;
					TextView txtViewImage= (TextView) findViewById(R.id.txtTituloImageView);
					txtViewImage.setText(title);
					 ImageView imgViews= (ImageView) findViewById(R.id.imgView1);
					 imgViews.setImageBitmap(bmp); 
				}
			});

		}

	}

	
	
}
