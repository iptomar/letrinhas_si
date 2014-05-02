package com.example.letrinhas.ClassesObjs;

/**
 * Created by Alex on 29/04/2014.
 */
public class TesteMultimedia extends Teste{

    protected String conteudoQuestao;
    protected boolean contentIsUrl;

    protected String opcao1;
    protected boolean opcao1IsUrl;

    protected String opcao2;
    protected boolean opcao2IsUrl;

    protected String opcao3;
    protected boolean opcao3IsUrl;

    protected int correctOption;

    public TesteMultimedia(String conteudoQuestao, boolean contentIsUrl, String opcao1, boolean opcao1IsUrl, String opcao2, boolean opcao2IsUrl, String opcao3, boolean opcao3IsUrl, int correctOption) {
        this.conteudoQuestao = conteudoQuestao;
        this.contentIsUrl = contentIsUrl;
        this.opcao1 = opcao1;
        this.opcao1IsUrl = opcao1IsUrl;
        this.opcao2 = opcao2;
        this.opcao2IsUrl = opcao2IsUrl;
        this.opcao3 = opcao3;
        this.opcao3IsUrl = opcao3IsUrl;
        this.correctOption = correctOption;
    }

    public TesteMultimedia(int idTeste,int areaId ,int professorId,  String titulo, String texto, long dataInsercaoTeste, int grauEscolar,int tipo ,String conteudoQuestao, boolean contentIsUrl, String opcao1, boolean opcao1IsUrl, String opcao2, boolean opcao2IsUrl, String opcao3, boolean opcao3IsUrl, int correctOption) {
        super(idTeste, areaId,professorId ,titulo, texto, dataInsercaoTeste, grauEscolar,tipo);
        this.conteudoQuestao = conteudoQuestao;
        this.contentIsUrl = contentIsUrl;
        this.opcao1 = opcao1;
        this.opcao1IsUrl = opcao1IsUrl;
        this.opcao2 = opcao2;
        this.opcao2IsUrl = opcao2IsUrl;
        this.opcao3 = opcao3;
        this.opcao3IsUrl = opcao3IsUrl;
        this.correctOption = correctOption;
    }

    public String getConteudoQuestao() {
        return conteudoQuestao;
    }

    public void setConteudoQuestao(String conteudoQuestao) {
        this.conteudoQuestao = conteudoQuestao;
    }

    public boolean isContentIsUrl() {
        return contentIsUrl;
    }

    public void setContentIsUrl(boolean contentIsUrl) {
        this.contentIsUrl = contentIsUrl;
    }

    public String getOpcao1() {
        return opcao1;
    }

    public void setOpcao1(String opcao1) {
        this.opcao1 = opcao1;
    }

    public boolean getOpcao1IsUrl() {
        return opcao1IsUrl;
    }

    public void setOpcao1IsUrl(boolean opcao1IsUrl) {
        this.opcao1IsUrl = opcao1IsUrl;
    }

    public String getOpcao2() {
        return opcao2;
    }

    public void setOpcao2(String opcao2) {
        this.opcao2 = opcao2;
    }

    public boolean getOpcao2IsUrl() {
        return opcao2IsUrl;
    }

    public void setOpcao2IsUrl(boolean opcao2IsUrl) {
        this.opcao2IsUrl = opcao2IsUrl;
    }

    public String getOpcao3() {
        return opcao3;
    }

    public void setOpcao3(String opcao3) {
        this.opcao3 = opcao3;
    }

    public boolean getOpcao3IsUrl() {
        return opcao3IsUrl;
    }

    public void setOpcao3IsUrl(boolean opcao3IsUrl) {
        this.opcao3IsUrl = opcao3IsUrl;
    }

    public int getCorrectOption() {
        return correctOption;
    }

    public void setCorrectOption(int correctOption) {
        this.correctOption = correctOption;
    }
}
