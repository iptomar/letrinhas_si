package com.example.androidhive;

import java.io.ByteArrayOutputStream;
import java.io.UnsupportedEncodingException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

public class Send_ResultTest extends Activity {
	// Progress Dialog
		private ProgressDialog pDialog;

		JSONParser jsonParser = new JSONParser();
		EditText inputId;
		EditText inputTestId;
		EditText inputCompletionDate;
		EditText inputStudentName;
		EditText inputVoiceBase64;

		// url DO servidor, preenchido em baixo 
		private static String url_Server = "";

		@Override
		public void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			setContentView(R.layout.activity_send_result_test);
			
			// Obtendo Detalhes dos Testes do intent
			Intent i = getIntent();
						
	    	// Obtendo CAMPO IP e PORTA enviados para esta Janela
			String ip = i.getStringExtra("IP");
			String porta = i.getStringExtra("PORTA");
			url_Server = "http://"+ip+":"+porta+"/postTestResults"; 
			
			
			// Preenchimento das variaveis do a informacao da janela
			inputId = (EditText) findViewById(R.id.txtBoxId);
			inputTestId = (EditText) findViewById(R.id.txtBoxtestId);
			inputCompletionDate = (EditText) findViewById(R.id.txtBoxDate);
			inputStudentName = (EditText) findViewById(R.id.txtBoxStudentName);
			inputVoiceBase64 = (EditText) findViewById(R.id.txtBoxVoiceB);
			// criar o botao
			Button btnSend = (Button) findViewById(R.id.btnSendResult);

			// evento do botao
			btnSend.setOnClickListener(new View.OnClickListener() {
				@Override
				public void onClick(View view) {
					// creating new product in background thread
					new SendResult().execute();
				}
			});
		}

		/**
		 * Background Async Task para enviar os resultadost
		 * */
		class SendResult extends AsyncTask<String, String, String> {

			/**
			 * Antes de começar o processo exibe uma Progress Dialog
			 * */
			@Override
			protected void onPreExecute() {
				super.onPreExecute();
				pDialog = new ProgressDialog(Send_ResultTest.this);
				pDialog.setMessage("Enviando....");
				pDialog.setIndeterminate(false);
				pDialog.setCancelable(true);
				pDialog.show();
			}

			/**
			 * Envia os Resultados
			 * */
			protected String doInBackground(String... args) {
				String id = inputId.getText().toString();
				String testId = inputTestId.getText().toString();
				String date = inputCompletionDate.getText().toString();
				String studentName = inputStudentName.getText().toString();
				String voiceBase64 = inputVoiceBase64.getText().toString();
				 

				String base64 ="";

					byte[] data;
					try {
						data = voiceBase64.getBytes("UTF-8");
						 base64 = Base64.encodeToString(data, Base64.DEFAULT);
					} catch (UnsupportedEncodingException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					} 
                
		//////////////Teste De código para converter imagem para Base64//////////////////
			    	//	String filePath= "drawable/ic_launcher.png";
					// Bitmap  bm = BitmapFactory.decodeFile(filePath);
					// ByteArrayOutputStream baos = new ByteArrayOutputStream();  
					// bm.compress(Bitmap.CompressFormat.JPEG, 100, baos);  
					// byte[] b = baos.toByteArray(); 

					//String imageStr = Base64.encodeToString(b, Base64.DEFAULT);
					 
					// System.out.println("*************"+imageStr+"********");
					 

				//Criar o ficheiro de JSON
				 JSONObject jObj = new JSONObject();
				 JSONArray solvedTests = new JSONArray();
				 JSONObject solvedTest = new JSONObject();
				  try {
					  solvedTest.put("id", id);
					  solvedTest.put("testId", testId);
					  solvedTest.put("completionDate", date);
					  solvedTest.put("studentName", studentName);
					  solvedTest.put("voiceBase64", base64.substring(0, base64.length()-1));
					  solvedTests.put(solvedTest);
					  jObj.put("solvedTests", solvedTests);
				  } catch (JSONException e) {
				    e.printStackTrace();
				  }
				jsonParser.Post(url_Server, jObj);
				return null;
			}

			/**
			 * Depois de concluida a background task fecha a Progress dialog
			 * **/
			protected void onPostExecute(String file_url) {
				// dismiss the dialog once done
				pDialog.dismiss();
			}

		}
}
