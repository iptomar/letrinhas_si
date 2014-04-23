package com.example.letrinhas;

import android.app.Activity;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import com.example.androidhive.R;

public class ReprodAudio extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reprod_audio);
        Button btnTocarSom = (Button) findViewById(R.id.btnTocarSom);


        btnTocarSom.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                MediaPlayer mp = MediaPlayer.create(getBaseContext(), R.raw.mp1);
                // Play audio
                mp.start();
            }
        });

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.reprod_audio, menu);
        return true;
    }

}
