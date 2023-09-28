import { Component, OnInit } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  ngrok = "http://54.234.130.145/APInventario";
  constructor(private alertController: AlertController) { }

  ngOnInit() {
    if(localStorage.getItem('LoginID')){
      window.location.href = '/folder/Outbox';
    }
  }
  async presentAlert(titulo:String, mensaje:String) {
    const alert = await this.alertController.create({
      header: String(titulo),
      message: String(mensaje),
      buttons: ['OK'],
    });
    await alert.present();
  }
  Login(){
    const log_usuario = document.getElementById("log_usuario") as HTMLInputElement;
    const log_password = document.getElementById("log_password") as HTMLInputElement;
    var formdata = new FormData();
    formdata.append("op", "login");
    formdata.append("tk", "MBA2021");
    formdata.append("log_usuario", log_usuario.value);
    formdata.append("log_password", log_password.value);

    var requestOptions = {
      method: 'POST',
      body: formdata
    };

    fetch(this.ngrok + "/api_pul/ws.php", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        if(result){
          localStorage.setItem('LoginID', result[0].log_id);
          window.location.href = '/folder/Outbox';
        }else{
          this.presentAlert('Error al entrar','Usuario ó contraseña incorrecta.');
        }
      })
      .catch(error => console.log('error', error));
  }
}
