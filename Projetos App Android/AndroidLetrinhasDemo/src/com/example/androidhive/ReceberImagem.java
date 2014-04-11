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
	private static String url_all_tests = ""; 
	byte[] arrayBytesImage;
	String title;

	// Criar o objecto JSON Parser
	JSONParser jParser = new JSONParser();
	// JSON Nome dos campos
	private static final String TAG_SUCCESS = "success";
	private static final String TAG_TESTS = "tests";
	private static final String TAG_PID = "id";
	private static final String TAG_TITLE = "title";
	private static final String TAG_IMG = "image";
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
		url_all_tests = "http://" + ip + ":" + porta + "/image";

		// Buttons
		Button btnReceberImg = (Button) findViewById(R.id.btnReceberImg);
		Button btnLerDaBD = (Button) findViewById(R.id.btnGuardarEmBD);

		// Botao receber imagem  do servidor e guardar na BD
		btnReceberImg.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View view) {
				new ReceberImg().execute();
			}
		});

		// Botao receber imagem do servidor
		btnLerDaBD.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View view) {
				//Vai ler o campo 1 da base de  dados
				LerDaBd(1);
			}
		});

	}

	class ReceberImg extends AsyncTask<String, String, String> {
		protected static final String LETRINHAS_APP_TAG = "letrinhas-app";

		/**
		 * Antes de iniciar a Thread Background aparece a progress Dialog
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
				// verifica a Tag SUCCESS, usada para verificar de a mensagem
				// chegou a nós como deve ser
				int success = json.getInt(TAG_SUCCESS);
				if (success == 1) {
					
					// Armazenar cada item json nas variáveis
					String id = json.getString(TAG_PID);
					title = json.getString(TAG_TITLE);
					String text = json.getString(TAG_IMG);
					arrayBytesImage = Base64.decode(text, Base64.DEFAULT);
					/// Chama o metodo e guarda os dados na base de dados
					GuardarNaBd(title, arrayBytesImage);
				} else {
					// Sem testes Encontrados
					AlertDialog.Builder alertDialog = new AlertDialog.Builder(
							ReceberImagem.this);
					alertDialog.setMessage("Sem Registos");
					alertDialog.show();
				}
			} catch (Exception e) {
				Log.wtf(LETRINHAS_APP_TAG, "WTF no JSON");
				e.printStackTrace();
			}
			return null;
		}

		/**
		 * Depois de completar tarefa de background Fechar a Progress Dialog
		 * **/
		protected void onPostExecute(String file_url) {
			// fechar a janela de Progress Dialog depois de receber todos os
			// Tests
			pDialog.dismiss();
			// Actualizar a UI a partir da Background Thread
			runOnUiThread(new Runnable() {
				public void run() {

					Bitmap bmp = BitmapFactory.decodeByteArray(arrayBytesImage,
							0, arrayBytesImage.length);
					// Acede aos objectos da janela e preenche com informação;
					//Neste caso preenche  a label de titulo da imagem
					//Exibe a imagem
					TextView txtViewImage = (TextView) findViewById(R.id.txtTituloImageView);
					txtViewImage.setText(title);
					ImageView imgViews = (ImageView) findViewById(R.id.imgView1);
					imgViews.setImageBitmap(bmp);
				}
			});

		}

	}

	/**
	 * GuardaNaBD - Guarda dados na base de dados
	 * Recebe o campo nome da imagem, e a imagem em ARRAY DE BYTES
	 * **/
	public void GuardarNaBd(String name, byte[] image) {
		DatabaseHandler db = new DatabaseHandler(this);
		/**
		 * CRUD Operations
		 * */
		// Inserting Contacts
		Log.d("Insert: ", "Inserting ..");
		db.addNewItem(new DadosImg(name, image));

		// Reading all contacts
		Log.d("Reading: ", "Reading all contacts..");
		List<DadosImg> dadosImg = db.getAllContacts();

		for (DadosImg cn : dadosImg) {
			String log = "Id: " + cn.getID() + " ,Name: " + cn.getName()
					+ " ,image: " + cn.getImage();
			// Writing Contacts to log
			Log.d("Name: ", log);

		}
	}
	
	/**
	 * LerDaBd - Vai ler uma linha na base de dados enviada por parametro
	 * Recebe como parametro o id do campo que se pretende ler
	 * **/
	public void LerDaBd(int idCampo) {
		DatabaseHandler db = new DatabaseHandler(this);
		DadosImg data = db.getItemById(idCampo);

		// dadosImg.get(5)
		byte[] imgBytes = data.getImage();
		
		TextView txtViewImage = (TextView) findViewById(R.id.txtTituloImageView);
		txtViewImage.setText(data.getName());

		Log.d("letrinhas",
				String.format("Tamanho da imagem: %d", imgBytes.length));

		Bitmap bmp = BitmapFactory.decodeByteArray(imgBytes, 0, imgBytes.length);
		ImageView imgViews = (ImageView) findViewById(R.id.imgView1);
		imgViews.setImageBitmap(bmp);
	}
	
}
