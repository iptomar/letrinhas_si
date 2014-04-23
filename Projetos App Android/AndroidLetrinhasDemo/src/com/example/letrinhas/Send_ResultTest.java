package com.example.letrinhas;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Base64;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import com.example.androidhive.R;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;

public class Send_ResultTest extends Activity {
    // url DO servidor, preenchido em baixo
    private static String url_Server = "";
    JSONParser jsonParser = new JSONParser();
    EditText inputId;
    EditText inputTestId;
    EditText inputCompletionDate;
    EditText inputStudentName;
    EditText inputVoiceBase64;
    // Progress Dialog
    private ProgressDialog pDialog;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_send_result_test);

        // Obtendo Detalhes dos Testes do intent
        Intent i = getIntent();

        // Obtendo CAMPO IP e PORTA enviados para esta Janela
        String ip = i.getStringExtra("IP");
        String porta = i.getStringExtra("PORTA");
        url_Server = "http://" + ip + ":" + porta + "/postTestResults";

        // Preenchimento das variaveis do a informacao da janela
        inputId = (EditText) findViewById(R.id.txtBoxId);
        inputTestId = (EditText) findViewById(R.id.txtBoxtestId);
        inputCompletionDate = (EditText) findViewById(R.id.txtBoxDate);
        inputStudentName = (EditText) findViewById(R.id.txtBoxStudentName);

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
     */
    class SendResult extends AsyncTask<String, String, String> {

        /**
         * Antes de come�ar o processo exibe uma Progress Dialog
         */
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
         */
        protected String doInBackground(String... args) {
            String id = inputId.getText().toString();
            String testId = inputTestId.getText().toString();
            String date = inputCompletionDate.getText().toString();
            String studentName = inputStudentName.getText().toString();

            // ////////////Teste De c�digo para converter imagem para
            // Vai buscar uma imagem interna a aplicacao//////////////////
            Bitmap bm = BitmapFactory.decodeResource(getResources(), R.drawable.ax);
            ByteArrayOutputStream baos = new ByteArrayOutputStream(); // Transforma a imagem num array de bytes
            bm.compress(Bitmap.CompressFormat.JPEG, 100, baos);
            byte[] b = baos.toByteArray();
            String encodedImage = Base64.encodeToString(b, Base64.DEFAULT); //Faz o encoding para BASE64

            // Criar o ficheiro de JSON
            JSONObject jObj = new JSONObject();
            JSONArray solvedTests = new JSONArray();
            JSONObject solvedTest = new JSONObject();
            try {
                solvedTest.put("id", id);
                solvedTest.put("testId", testId);
                solvedTest.put("completionDate", date);
                solvedTest.put("studentName", studentName);
                solvedTest.put("voiceBase64", encodedImage);
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
         * *
         */
        protected void onPostExecute(String file_url) {
            // dismiss the dialog once done
            pDialog.dismiss();
        }

    }
}
