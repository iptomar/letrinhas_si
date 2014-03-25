package com.example.androidhive;

import android.os.AsyncTask;
import android.os.Bundle;
import android.app.Activity;
import android.app.ProgressDialog;
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

		// url to create new product
		private static String url_create_product = "http://192.168.1.3:8080/postTestResults";

		// JSON Node names
		private static final String TAG_SUCCESS = "success";

		@Override
		public void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			setContentView(R.layout.activity_send_result_test);

			// Edit Text
			inputId = (EditText) findViewById(R.id.txtBoxId);
			inputTestId = (EditText) findViewById(R.id.txtBoxtestId);
			inputCompletionDate = (EditText) findViewById(R.id.txtBoxDate);
			inputStudentName = (EditText) findViewById(R.id.txtBoxStudentName);
			inputVoiceBase64 = (EditText) findViewById(R.id.txtBoxVoiceB);
			// Create button
			Button btnSend = (Button) findViewById(R.id.btnSendResult);

			// button click event
			btnSend.setOnClickListener(new View.OnClickListener() {

				@Override
				public void onClick(View view) {
					// creating new product in background thread
					new SendResult().execute();
				}
			});
		}

		/**
		 * Background Async Task to Send Result
		 * */
		class SendResult extends AsyncTask<String, String, String> {

			/**
			 * Before starting background thread Show Progress Dialog
			 * */
			@Override
			protected void onPreExecute() {
				super.onPreExecute();
				pDialog = new ProgressDialog(Send_ResultTest.this);
				pDialog.setMessage("Sending....");
				pDialog.setIndeterminate(false);
				pDialog.setCancelable(true);
				pDialog.show();
			}

			/**
			 * Sending Result
			 * */
			protected String doInBackground(String... args) {
				String id = inputId.getText().toString();
				String testId = inputTestId.getText().toString();
				String date = inputCompletionDate.getText().toString();
				String studentName = inputStudentName.getText().toString();
				String voiceBase64 = inputVoiceBase64.getText().toString();

				// Building Parameters
		    //List<NameValuePair> params = new ArrayList<NameValuePair>();
			//	params.add(new BasicNameValuePair("name", name));
			//	params.add(new BasicNameValuePair("price", price));
			//	params.add(new BasicNameValuePair("description", description));

			//System.out.println("*************************  "+params.get(2));
				// getting JSON Object
				// Note that create product url accepts POST method
			
		String campos = "{\"solvedTests\": " +
				"[{\"id\": "+id+", " +
				"\"testId\": "+testId+"," +
				"\"completionDate\": \" "+date+" \"," +
				"\"studentName\": \""+studentName+"\"," +
				"\"voiceBase64\": \""+voiceBase64+"\"}]} ";
		
		
			//	JSONObject json = jsonParser.makeHttpRequest(url_create_product,
				//		"POST", params);
				jsonParser.Post(url_create_product, campos);
				// check log cat fro response
				//Log.d("Create Response", json.toString());
				return null;
			}

			/**
			 * After completing background task Dismiss the progress dialog
			 * **/
			protected void onPostExecute(String file_url) {
				// dismiss the dialog once done
				pDialog.dismiss();
			}

		}
}
