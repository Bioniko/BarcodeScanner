import { Component, OnInit} from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.page.html',
  styleUrls: ['./proveedor.page.scss'],
})
export class ProveedorPage implements OnInit {
  ngrok = "http://54.234.130.145/APInventario";
  prov: any = [];
  prod: any = [];
  constructor(private alertController: AlertController) { }

  ngOnInit() {
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

  async presentAlert(titulo:String, mensaje:String) {
    const alert = await this.alertController.create({
      header: String(titulo),
      message: String(mensaje),
      buttons: ['OK'],
    });
    await alert.present();
  }

  productos_by_proveedor(){
    const prov_id = document.getElementById("proveedor") as HTMLInputElement;
    var formdata = new FormData();
    formdata.append("tk", "MBA2021");
    formdata.append("op", "get_productos_by_proveedor");
    formdata.append("cli_id", String(localStorage.getItem('LoginID')));
    formdata.append("prov_id", prov_id.value);

    var requestOptions = {
      method: 'POST',
      body: formdata
    };

    fetch(this.ngrok + "/api_pul/ws.php", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        if(result){ 
          this.prod = result;
        }
      })
      .catch(error => console.log('error', error));
  }


  Mas(id:String){
    var num = 1;
    const cant = document.getElementById("cantidad" + id) as HTMLInputElement;
    num = parseInt(cant.value) + 1;
    cant.value = String(num);
    for (let i= 0; i < this.prod.length; i++) {
      if(this.prod[i].pro_id == id){
        this.prod[i].subtotal = parseInt(this.prod[i].subtotal) + parseInt(this.prod[i].pro_precio);
      }
    }
 }

 Menos(id:String){
    var num = 1;
    const cant = document.getElementById("cantidad" + id) as HTMLInputElement;
    if(parseInt(cant.value) >= 1){
      num = parseInt(cant.value) - 1;
      cant.value = String(num);
      for (let i= 0; i < this.prod.length; i++) {
        if(this.prod[i].pro_id == id){
          this.prod[i].subtotal = this.prod[i].subtotal - this.prod[i].pro_precio;
        }
      }
    }
  }

  btnGuardar(){
    const nfactura = document.getElementById("nfactura") as HTMLInputElement;
    const ftp_total_pagar = document.getElementById("ftp_total_pagar") as HTMLInputElement;
    const prov_id = document.getElementById("proveedor") as HTMLSelectElement;
    if(nfactura.value == ""){this.presentAlert('Faltan Datos','Agrege el número de la factura.');return;}
    if(ftp_total_pagar.value == ""){this.presentAlert('Faltan Datos','Agrege el total a pagar de la factura.');return;}
    if(prov_id.value == null){this.presentAlert('Faltan Datos','Agrege el proveedor del producto.');return;}
    var formdata = new FormData();
    formdata.append("tk", "MBA2021");
    formdata.append("op", "insertar_total_pagar");
    formdata.append("log_id", String(localStorage.getItem('LoginID')));
    formdata.append("ftp_numero_factura", nfactura.value);
    formdata.append("ftp_total_pagar", ftp_total_pagar.value);

    var requestOptions = {
      method: 'POST',
      body: formdata
    };

    fetch(this.ngrok + "/api_pul/ws.php", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        if(result){
          const j = this.prod.length - 1;
          for (let i = 0; i < this.prod.length; i++) {
            const cantidad = document.getElementById("cantidad" + this.prod[i].pro_id) as HTMLInputElement;
            
            var formdata = new FormData();
            formdata.append("tk", "MBA2021");
            formdata.append("op", "insertar_factura");
            formdata.append("log_id", String(localStorage.getItem('LoginID')));
            formdata.append("pro_id", this.prod[i].pro_id);
            formdata.append("ftp_id", String(result));
            formdata.append("fac_cantidad", cantidad.value);

            var requestOptions = {
              method: 'POST',
              body: formdata
            };

            fetch(this.ngrok + "/api_pul/ws.php", requestOptions)
              .then(response => response.json())
              .then(result => {
                console.log(result);

                if(i == j){
                  this.presentAlert("Factura Guardada", "Se guardo factura exitosamente.");
                  cantidad.value = "";
                  nfactura.value = "";
                  ftp_total_pagar.value = "";
                  prov_id.value = "";
                }
              })
              .catch(error => console.log('error', error));
            }
            this.prod = [];
        }
      })
      .catch(error => console.log('error', error));
  }  
}
