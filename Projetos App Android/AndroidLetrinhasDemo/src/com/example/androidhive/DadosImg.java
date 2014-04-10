package com.example.androidhive;

public class DadosImg {
	
	//private variables
	int id;
	String name;
	byte[] image;
	
	// Empty constructor
	public DadosImg(){
		
	}
	// constructor 1
	public DadosImg(int id, String name, 	byte[] image){
		this.id = id;
		this.name = name;
		this.image = image;
	}
	
	// constructor 2
		public DadosImg( String name, 	byte[] image){
			this.name = name;
			this.image = image;
		}
	
	// getting ID
	public int getID(){
		return this.id;
	}
	
	// setting id
	public void setID(int id){
		this.id = id;
	}
	
	// getting name
	public String getName(){
		return this.name;
	}
	
	// setting name
	public void setName(String name){
		this.name = name;
	}
	
	// getting phone number
	public 	byte[] getImage(){
		return this.image;
	}
	
	// setting phone number
	public void setImage(	byte[] image){
		this.image = image;
	}
}
