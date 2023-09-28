import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Haptics} from '@capacitor/haptics';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  scanActive: boolean = false;
  ngrok = "http://54.234.130.145/APInventario";
  prov: any = [];
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

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner() {
    const allowed = await this.checkPermission();
    if (allowed) {
      this.scanActive = true;
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        this.scanActive = false;
        Haptics.vibrate({duration:250});//Hace vibrar el celular cuando encuentra el producto
        const input = document.getElementById("codigobar") as HTMLInputElement;
        const pro_nombre = document.getElementById("pro_nombre") as HTMLInputElement;
        const pro_precio = document.getElementById("pro_precio") as HTMLInputElement;
        const prov_id = document.getElementById("proveedor") as HTMLInputElement;
        const pro_descripcion = document.getElementById("pro_descripcion") as HTMLInputElement;
        input.value = String(result.content);
        //==========================================API=========================================
        var formdata = new FormData();
        formdata.append("tk", "MBA2021");
        formdata.append("op", "mostrar_producto");
        formdata.append("cli_id", String(localStorage.getItem('LoginID')));
        formdata.append("pro_codigobarra", String(result.content));
        var requestOptions = {
          method: 'POST',
          body: formdata
        };
        fetch(this.ngrok + "/api_pul/ws.php", requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result);
            if(result != 0){
              pro_nombre.value = result[0].pro_nombre;
              pro_precio.value = result[0].pro_precio;
              prov_id.value = result[0].prov_id;
              pro_descripcion.value = result[0].pro_descripcion;
            }else{
              pro_nombre.value = "";
              pro_precio.value = "";
              prov_id.value = "";
              pro_descripcion.value = "";
            }
          })
          .catch(error => console.log('error', error));
        //==========================================API=========================================
      } else {
        this.presentAlert('No se encontro','No se encontro producto!');
      }
    } else {
      this.presentAlert('No permitido','No Permitido!');
    }
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
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

  GuardarProducto(){
    const input = document.getElementById("codigobar") as HTMLInputElement;
    const pro_nombre = document.getElementById("pro_nombre") as HTMLInputElement;
    const pro_precio = document.getElementById("pro_precio") as HTMLInputElement;
    const prov_id = document.getElementById("proveedor") as HTMLInputElement;
    const pro_descripcion = document.getElementById("pro_descripcion") as HTMLInputElement;
    if(input.value == ""){this.presentAlert('Faltan Datos','Agrege el código de barra del producto.');return;}
    if(pro_nombre.value == ""){this.presentAlert('Faltan Datos','Agrege el nombre del producto.');return;}
    if(pro_precio.value == ""){this.presentAlert('Faltan Datos','Agrege el precio del producto.');return;}
    if(prov_id.innerHTML == ""){this.presentAlert('Faltan Datos','Agrege el proveedor del producto.');return;}
    var formdata = new FormData();
    formdata.append("tk", "MBA2021");
    formdata.append("op", "registrar_producto");
    formdata.append("cli_id", String(localStorage.getItem('LoginID')));
    formdata.append("pro_codigobarra", input.value);
    formdata.append("pro_nombre", pro_nombre.value);
    formdata.append("pro_precio", pro_precio.value);
    formdata.append("prov_id", prov_id.value);
    formdata.append("pro_descripcion", pro_descripcion.value);

    var requestOptions = {
      method: 'POST',
      body: formdata
    };

    fetch(this.ngrok + "/api_pul/ws.php", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        input.value = "";
        pro_nombre.value = "";
        pro_precio.value = "";
        prov_id.value = "";
        pro_descripcion.value = "";
        this.presentAlert('Datos Guardados','Se agrego el producto');
      })
      .catch(error => console.log('error', error));
  }

  Buscar(){
      const input = document.getElementById("codigobar") as HTMLInputElement;
      const pro_nombre = document.getElementById("pro_nombre") as HTMLInputElement;
      const pro_precio = document.getElementById("pro_precio") as HTMLInputElement;
      const prov_id = document.getElementById("proveedor") as HTMLInputElement;
      const pro_descripcion = document.getElementById("pro_descripcion") as HTMLInputElement;
      //==========================================API=========================================
      var formdata = new FormData();
      formdata.append("tk", "MBA2021");
      formdata.append("op", "mostrar_producto");
      formdata.append("cli_id", String(localStorage.getItem('LoginID')));
      formdata.append("pro_codigobarra", input.value);
      var requestOptions = {
        method: 'POST',
        body: formdata
      };
      fetch(this.ngrok + "/api_pul/ws.php", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if(result != 0){
            pro_nombre.value = result[0].pro_nombre;
            pro_precio.value = result[0].pro_precio;
            prov_id.value = result[0].prov_id;
            pro_descripcion.value = result[0].pro_descripcion;
          }else{
            pro_nombre.value = "";
            pro_precio.value = "";
            prov_id.value = "";
            pro_descripcion.value = "";
            this.presentAlert('No se encontro producto','No se encontro el producto con código: ' + input.value);
          }
        })
        .catch(error => console.log('error', error));
      //==========================================API=========================================
  }
}
