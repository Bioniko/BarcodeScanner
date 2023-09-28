import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Haptics} from '@capacitor/haptics';
import { HttpClientModule } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-vender',
  templateUrl: './vender.page.html',
  styleUrls: ['./vender.page.scss'],
})
export class VenderPage implements OnInit {
  scanActive: boolean = false;
  sum: number = 0;
  i: number = 0;
  temp: any = [];
  prod: any = [];
  total = 0;
  banderita = 0;
  mastotal = 0;
  ngrok = "http://54.234.130.145/APInventario";
  constructor(public elementRef:ElementRef, public renderer:Renderer2, private http: HttpClientModule,private alertController: AlertController) {}

  ngOnInit() {
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

  ngAfterViewChecked() {
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
        const total = document.getElementById("total") as HTMLInputElement;
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
            if(result){
              if(this.prod.length != 0){
                console.log('1');
                for (let i = 0; i < this.prod.length; i++) {
                  console.log('2');
                  if(this.prod[i].pro_id == result[0].pro_id){
                    console.log('3');
                    this.Mas(this.prod[i].pro_id);
                    return
                  }
                }
                console.log('4');
                result[0].subtotal = result[0].pro_precio;
                this.temp = result[0];
                this.prod.push(this.temp);
                this.Total();
                console.log(this.prod);
              }else{
                console.log('5');
                result[0].subtotal = result[0].pro_precio;
                this.temp = result[0];
                this.prod.push(this.temp);
                this.Total();
              }
            }else{
              this.presentAlert('Dato no encontrado','No se encontro el producto con código: ' + input.value);
            }
          })
          .catch(error => console.log('error', error));
        //==========================================API=========================================
      } else {
        this.presentAlert('Dato no encontrado','No se encontro producto!');
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

    Buscar(){
      const input = document.getElementById("codigobar") as HTMLInputElement;
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
          if(result){
            if(this.prod.length != 0){
              console.log('1');
              for (let i = 0; i < this.prod.length; i++) {
                console.log('2');
                if(this.prod[i].pro_id == result[0].pro_id){
                  console.log('3');
                  this.Mas(this.prod[i].pro_id);
                  return
                }
              }
              console.log('4');
              result[0].subtotal = result[0].pro_precio;
              this.temp = result[0];
              this.prod.push(this.temp);
              this.Total();
              console.log(this.prod);
            }else{
              result[0].subtotal = result[0].pro_precio;
              this.temp = result[0];
              this.prod.push(this.temp);
              this.Total();
            }
          }else{
            this.presentAlert('Dato no encontrado','No se encontro el producto con código: ' + input.value);
          }
        })
        .catch(error => console.log('error', error));
      //==========================================API=========================================
    }

    public EliminarElemento(id:number) {
       this.temp = [];
       for (let i= 0; i < this.prod.length; i++) {
        if(this.prod[i].pro_id != id){
          this.temp.push(this.prod[i]);
        }
       }
       this.prod = this.temp;
       this.Total();
    }

    public Total() {
      this.total = 0;
      for (let i= 0; i < this.prod.length; i++) {
        this.total = this.total + parseInt(this.prod[i].subtotal) + this.mastotal;
      }
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
      this.Total();
   }

   Menos(id:String){
      var num = 1;
      const cant = document.getElementById("cantidad" + id) as HTMLInputElement;
      if(parseInt(cant.value) >= 2){
        num = parseInt(cant.value) - 1;
        cant.value = String(num);
        for (let i= 0; i < this.prod.length; i++) {
          if(this.prod[i].pro_id == id){
            this.prod[i].subtotal = this.prod[i].subtotal - this.prod[i].pro_precio;
          }
        }
        this.Total();
      }
    }

  btnVender(){
    const input = document.getElementById("codigobar") as HTMLInputElement;
    for (let i = 0; i < this.prod.length; i++) {
      const cantida = document.getElementById('cantidad' + this.prod[i].pro_id) as HTMLInputElement;
      var formdata = new FormData();
      formdata.append("op", "vender_producto");
      formdata.append("tk", "MBA2021");
      formdata.append("cli_id", String(localStorage.getItem('LoginID')));
      formdata.append("pro_id", String(this.prod[i].pro_id));
      formdata.append("ven_cantidad", cantida.value);
      formdata.append("ven_precio_sumado", String(this.prod[i].subtotal));

      var requestOptions = {
        method: 'POST',
        body: formdata
      };

      fetch(this.ngrok + "/api_pul/ws.php", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if(result){
            this.prod = [];
            if(i == this.prod.length){
              this.presentAlert('Dato Guardado','Se guardo la venta exitosamente.');
              this.total = 0;
              input.value = "";
            }
          }
        })
        .catch(error => console.log('error', error));
    }
  }
}


