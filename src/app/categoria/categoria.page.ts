import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
})
export class CategoriaPage implements OnInit {
  ngrok = "http://54.234.130.145/APInventario";
  prov: any = [];
  constructor(private alertController: AlertController) { }

  ngOnInit() {
    this.Proveedores();
  }

  Proveedores(){ 
    var formdata = new FormData();
    formdata.append("tk", "MBA2021");
    formdata.append("op", "get_proveedor");
    formdata.append("log_id", String(localStorage.getItem('LoginID')));

    var requestOptions = {
      method: 'POST',
      body: formdata
    };

    fetch(this.ngrok + "/api_pul/ws.php", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.prov = result;
      })
      .catch(error => console.log('error', error));
  }

  Back() {
    history.back();
  }

  btnGuardar(){ 
    const proveedor = document.getElementById("proveedor") as HTMLInputElement;
    const prov_id = document.getElementById("prov_id") as HTMLInputElement;
    const prov_empresa = document.getElementById("prov_empresa") as HTMLInputElement;
    const prov_nombre = document.getElementById("prov_nombre") as HTMLInputElement;
    const prov_telefono = document.getElementById("prov_telefono") as HTMLInputElement;
    const prov_descripcion = document.getElementById("prov_descripcion") as HTMLInputElement;
    if(prov_empresa.value == ""){alert('Agrege el nombre de la empresa.');return;}
    var formdata = new FormData();
    formdata.append("tk", "MBA2021");
    formdata.append("op", "registrar_proveedor");
    formdata.append("log_id", String(localStorage.getItem('LoginID')));
    formdata.append("prov_empresa", prov_empresa.value);
    formdata.append("prov_nombre", prov_nombre.value);
    formdata.append("prov_telefono", prov_telefono.value);
    formdata.append("prov_descripcion", prov_descripcion.value);
    formdata.append("prov_id", prov_id.value);

    var requestOptions = {
      method: 'POST',
      body: formdata
    };

    fetch(this.ngrok + "/api_pul/ws.php", requestOptions)
      .then(response => response.json())
      .then(result => { 
        console.log(result);
        proveedor.value = "";
        prov_empresa.value = "";
        prov_nombre.value = "";
        prov_telefono.value = "";
        prov_descripcion.value = "";
        this.presentAlert('Datos Guardados','Se agrego el proveedor');
        this.ngOnInit();
      })
      .catch(error => console.log('error', error));
  }

  async presentAlert(titulo:String, mensaje:String) {
    const alert = await this.alertController.create({
      header: String(titulo),
      message: String(mensaje),
      buttons: ['OK'],
    });
    await alert.present();
  }

  TraerDatosProveedor(){
    const proveedor = document.getElementById("proveedor") as HTMLInputElement;
    const prov_id = document.getElementById("prov_id") as HTMLInputElement;
    const prov_empresa = document.getElementById("prov_empresa") as HTMLInputElement;
    const prov_nombre = document.getElementById("prov_nombre") as HTMLInputElement;
    const prov_telefono = document.getElementById("prov_telefono") as HTMLInputElement;
    const prov_descripcion = document.getElementById("prov_descripcion") as HTMLInputElement;
    for (let i = 0; i < this.prov.length; i++) {
      if (this.prov[i].prov_id == proveedor.value) {
        prov_id.value = this.prov[i].prov_id;
        prov_empresa.value = this.prov[i].prov_empresa;
        prov_nombre.value = this.prov[i].prov_nombre;
        prov_telefono.value = this.prov[i].prov_telefono;
        prov_descripcion.value = this.prov[i].prov_descripcion;
      }
    }
  }
  Limpiar(){
    const proveedor = document.getElementById("proveedor") as HTMLInputElement;
    const prov_id = document.getElementById("prov_id") as HTMLInputElement;
    const prov_empresa = document.getElementById("prov_empresa") as HTMLInputElement;
    const prov_nombre = document.getElementById("prov_nombre") as HTMLInputElement;
    const prov_telefono = document.getElementById("prov_telefono") as HTMLInputElement;
    const prov_descripcion = document.getElementById("prov_descripcion") as HTMLInputElement;
    proveedor.value = "";
    prov_id.value = "";
    prov_empresa.value = "";
    prov_nombre.value = "";
    prov_telefono.value = "";
    prov_descripcion.value = "";
  }
}
