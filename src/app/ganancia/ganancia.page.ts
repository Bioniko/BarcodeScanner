import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-ganancia',
  templateUrl: './ganancia.page.html',
  styleUrls: ['./ganancia.page.scss'],
})
export class GananciaPage implements OnInit {
  ngrok = "http://54.234.130.145/APInventario";
  prod: any = [];
  venta = 0;
  constructor(private alertController: AlertController) { }

  ngOnInit() {
    var formdata = new FormData();
    formdata.append("op", "ganancia_dia");
    formdata.append("tk", "MBA2021");
    formdata.append("cli_id", String(localStorage.getItem('LoginID')));

    var requestOptions = {
      method: 'POST',
      body: formdata
    };

    fetch(this.ngrok + "/api_pul/ws.php", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        if(result){
          this.venta = result[0].Venta;
          console.log(result);
        }
      })
      .catch(error => console.log('error', error));
    //=============================LISTA DE PRODUCTOS==========================================
    var formdata = new FormData();
    formdata.append("op", "producto_vendido");
    formdata.append("tk", "MBA2021");
    formdata.append("cli_id", String(localStorage.getItem('LoginID')));

    var requestOptions = {
      method: 'POST',
      body: formdata
    };

    fetch(this.ngrok + "/api_pul/ws.php", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        if(result){
          console.log(result);
          this.prod = result;
        }
      })
      .catch(error => console.log('error', error));
  }

  Back() {
    history.back();
  }

  async presentAlert(titulo:String, mensaje:String) {
    const alert = await this.alertController.create({
      header: String(titulo),
      message: String(mensaje),
      buttons: ['OK'],
    });
    await alert.present();
  }

}
