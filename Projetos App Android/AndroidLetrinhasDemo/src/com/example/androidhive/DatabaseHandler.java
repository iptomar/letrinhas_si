package com.example.androidhive;

import java.util.ArrayList;
import java.util.List;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class DatabaseHandler extends SQLiteOpenHelper {

	// Versão da base de dados
	private static final int DATABASE_VERSION = 1;

	// Nome da Base  de dados
	private static final String DATABASE_NAME = "letrinhasDb";
	// Nome da tabela da Base de dados
	private static final String TABLE_CONTACTS = "tblImages";

	// Nomes dos campos
	private static final String KEY_ID = "id";
	private static final String KEY_NAME = "name";
	private static final String KEY_IMAGE = "image";

	public DatabaseHandler(Context context) {
		super(context, DATABASE_NAME, null, DATABASE_VERSION);
	}

	// Criar Tabela
	@Override
	public void onCreate(SQLiteDatabase db) {
		String createTableString= "CREATE TABLE " + TABLE_CONTACTS + "("
				+ KEY_ID + " INTEGER PRIMARY KEY," + KEY_NAME + " TEXT,"
				+ KEY_IMAGE + " BLOB" + ")";
		db.execSQL(createTableString);
	}

	@Override
	public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
		// Apagar tabelas antigas existentes
		db.execSQL("DROP TABLE IF EXISTS " + TABLE_CONTACTS);
		// Create tables again
		onCreate(db);
	}

	/**
	 * Operacoes CRUD(Create, Read, Update, Delete) 
	 */

	// Adicionar Novo ItemComImagem
	void addNewItem(DadosImg contact) {
		SQLiteDatabase db = this.getWritableDatabase();

		ContentValues values = new ContentValues();
		values.put(KEY_NAME, contact.getName());   // Inserir na tabela campo Nome
		values.put(KEY_IMAGE, contact.getImage()); // Inserir na tabela campo Imagem
		// Inserir LINHAS:
		db.insert(TABLE_CONTACTS, null, values);
		db.close(); // Fechar a conecao a Base de dados
	}


	/**
	 * Buscar item pelo o ID do ITEM
	 * @id recebe o Id
	 * Retorna um objecto de dados do tipo Imagem
	 */
	DadosImg getItemById(int id) {
		
		SQLiteDatabase db = this.getReadableDatabase();
		Cursor cursor = db.query(TABLE_CONTACTS, 
				new String[] { KEY_ID,
				KEY_NAME, KEY_IMAGE }, 
				KEY_ID + "=?",
				new String[] { String.valueOf(id) }, 
				null, null, null, null);
		if (cursor != null)
			cursor.moveToFirst();
		DadosImg ItemImage = new DadosImg(Integer.parseInt(cursor.getString(0)),
				cursor.getString(1), cursor.getBlob(2));
		// return o Item ja carregado com os dados
		return ItemImage;
	}
	
	/**
	 * Buscar todos os Item Imagem da BD
	 * Retorna uma lista com varios objectos do tipo DadosImg
	 */
	public List<DadosImg> getAllContacts() {
		List<DadosImg> contactList = new ArrayList<DadosImg>();
		// Select TODOS OS DADOS
		String selectQuery = "SELECT  * FROM " + TABLE_CONTACTS;
		SQLiteDatabase db = this.getWritableDatabase();
		Cursor cursor = db.rawQuery(selectQuery, null);
		// loop através de todas as linhas e adicionando à lista
		if (cursor.moveToFirst()) {
			do {
				DadosImg contact = new DadosImg();
				contact.setID(Integer.parseInt(cursor.getString(0)));
				contact.setName(cursor.getString(1));
				contact.setImage(cursor.getBlob(2));
				// Adicionar os os items da base de dados a lista 
				contactList.add(contact);
			} while (cursor.moveToNext());
		}
		// return a lista com todos os items da base de dados
		return contactList;
	}

	/**
	 * Actualizar um registo unico
	 * @DadosImg  Objecto com os dados a actualizar
	 */
	public int updateContact(DadosImg contact) {
		SQLiteDatabase db = this.getWritableDatabase();
		ContentValues values = new ContentValues();
		values.put(KEY_NAME, contact.getName()); // Actualizar campo nome
		values.put(KEY_IMAGE, contact.getImage()); // Actualizar campo imagem
		// Actualizar registos na Base de dados
		return db.update(TABLE_CONTACTS, values, KEY_ID + " = ?",
				new String[] { String.valueOf(contact.getID()) });
	}

	
	/**
	 * Apagar registo unico
	 * @DadosImg  Objecto com os dados ao que se prentende apagar na bd
	 */
	public void deleteContact(DadosImg contact) {
		SQLiteDatabase db = this.getWritableDatabase();
		db.delete(TABLE_CONTACTS, KEY_ID + " = ?",
				new String[] { String.valueOf(contact.getID()) });
		db.close();
	}


	/**
	 * Obtendo Contagem Items na Base de  dados
	 * Retorna um inteiro com o total de resgisto da Base de dados
	 */
	public int getContactsCount() {
		String countQuery = "SELECT  * FROM " + TABLE_CONTACTS;
		SQLiteDatabase db = this.getReadableDatabase();
		Cursor cursor = db.rawQuery(countQuery, null);
		cursor.close();
		// return Total de registos da Base de Dados
		return cursor.getCount();
	}

}
