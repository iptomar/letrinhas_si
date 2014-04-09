package com.example.androidhive;

public class DadosImg {
	
	//private variables
	int id;
	String name;
	String image;
	
	// Empty constructor
	public DadosImg(){
		
	}
	// constructor
	public DadosImg(int id, String name, String image){
		this.id = id;
		this.name = name;
		this.image = image;
	}
	
	// constructor
		public DadosImg( String name, String image){
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
	public String getImage(){
		return this.image;
	}
	
	// setting phone number
	public void setImage(String image){
		this.image = image;
	}
}
