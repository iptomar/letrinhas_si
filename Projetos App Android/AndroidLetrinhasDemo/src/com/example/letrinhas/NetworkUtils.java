package com.example.letrinhas;

import android.net.http.AndroidHttpClient;
import android.util.Log;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.DefaultHttpClient;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class NetworkUtils {

    private static final String TAG_NET_UTILS = "net-utils";

    /**
     * Le um ficheiro a partir do url especificado.
     *
     * @param imageUrl O url do ficheiro.
     * @return Um array de bytes representando o ficheiro que foi lido, ou null
     * se ocorreu um erro.
     */
    public static byte[] getFile(final String imageUrl) {
        AndroidHttpClient client = AndroidHttpClient.newInstance("letrinhas");
        HttpGet getRequest = new HttpGet(imageUrl);
        try {
            HttpResponse response = client.execute(getRequest);

            HttpEntity entity = response.getEntity();
            InputStream in = entity.getContent();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            int size = -1;
            byte[] buf = new byte[1024];
            while ((size = in.read(buf)) != -1) {
                out.write(buf, 0, size);
            }

            /// fECHA TODAS AS LIGAÇÕES
            out.close();
            in.close();
            client.close();

            return out.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * em testes
     * Le um ficheiro a partir do url especificado.
     * <p/>
     * Usa uma biblioteca da Apache:
     * http://james.apache.org/download.cgi#Apache_Mime4J
     *
     * @param url O url do ficheiro.
     * @return Um array de bytes representando o ficheiro que foi lido, ou null
     * se ocorreu um erro.
     */
    public static void setFile(final String url, byte[] bm) {
        HttpClient httpClient = new DefaultHttpClient();


        HttpPost postRequest = new HttpPost(url);

        // HttpPost post = new HttpPost();

        MultipartEntityBuilder builder = MultipartEntityBuilder.create();

        builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);

        builder.addTextBody("name", "Whatever");
        // String uri = "android.resource://com.example.androidhive/"+R.raw.mp1;

        ///	File file = new File("res/raw/mp1.wav").getAbsoluteFile();

        //builder.addPart("ficheiro", new FileBody(file));

        // String filePath = file.getAbsolutePath();

        // File file = new File(filePath);
        // builder.addBinaryBody("ficheiro", file);

        //	Bitmap bm = BitmapFactory.decodeResource(getResources(), R.drawable.ax);
        //	ByteArrayOutputStream baos = new ByteArrayOutputStream(); // Transforma a imagem num array de bytes
        ///	bm.compress(Bitmap.CompressFormat.JPEG, 100, baos);
//		byte[] b = bm.toByteArray();
//		
//
        // builder.addBinaryBody("imagem", bm);
//		builder.addPart("imagem", new FileBody(getResources().openRawResource(R.raw.mp1)));

        postRequest.setEntity(builder.build());

        try {
            HttpResponse response = httpClient.execute(postRequest);

//			BufferedReader reader = new BufferedReader(new InputStreamReader(
//					response.getEntity().getContent(), "UTF-8"));
//			String sResponse;
//			StringBuilder s = new StringBuilder();
//			while ((sResponse = reader.readLine()) != null) {
//				s = s.append(sResponse);
//			}
        } catch (ClientProtocolException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }
}
