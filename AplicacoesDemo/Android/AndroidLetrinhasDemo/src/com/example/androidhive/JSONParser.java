package com.example.androidhive;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

public class JSONParser {

	static InputStream is = null;
	static JSONObject jObj = null;
	static String json = "";

	// constructor
	public JSONParser() {}

	/**
	 * Faz um HTTP request, onde recebe um Json e o envia com um Return
	 * Recebe como paramentros o URL do servidor e uma lista de paramentros a receber
	 * **/
	public JSONObject Get(String url, List<NameValuePair> params) {
		// Faz um HTTP request
		try {
				// executa o GET
				DefaultHttpClient httpClient = new DefaultHttpClient();
				String paramString = URLEncodedUtils.format(params, "utf-8");
				url += "?" + paramString;
				
				
				HttpGet httpGet = new HttpGet(url);
				HttpResponse httpResponse = httpClient.execute(httpGet);
				HttpEntity httpEntity = httpResponse.getEntity();
				is = httpEntity.getContent();
				
		} catch (Exception e) {e.printStackTrace();}

		try {
			BufferedReader reader = new BufferedReader(new InputStreamReader(is, "iso-8859-1"), 8);
			StringBuilder sb = new StringBuilder();
			String line = null;
			while ((line = reader.readLine()) != null) {
				sb.append(line + "\n");
			}
			is.close();
			json = sb.toString();
			
		} catch (Exception e) {
			Log.e("Erro no Buffer", "Erro a converter resultados" + e.toString());
		}
		// tentar analisar a sequencia do objeto JSON
		try {
			jObj = new JSONObject(json);
		} catch (JSONException e) {
			Log.e("JSON Parser", "Erro parsing " + e.toString());
		}
		// return JSON String
		return jObj;
	}
	

	/**
	 * Faz um HTTP request, onde envia um Json para o servidor com a informaçao
	 * Recebe como paramentros o URL do servidor e ficheiro de Json em String
	 * **/
	public void Post(String url, String camps)
	{		// método de solicitação é POST
		try {
		// defaultHttpClient
		DefaultHttpClient httpClient = new DefaultHttpClient();
		HttpPost httpPost = new HttpPost(url);
		httpPost.setEntity(new StringEntity(camps));
		HttpResponse httpResponse = httpClient.execute(httpPost);
		HttpEntity httpEntity = httpResponse.getEntity();
		is = httpEntity.getContent();
		} catch (Exception e) {
			Log.e("Erro no Buffer", "Erro a converter resultados" + e.toString());
		}
	}
	
	
	
	
	
	
}
