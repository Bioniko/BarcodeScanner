import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { getRelativePosition } from 'chart.js/helpers';
@Component({
  selector: 'app-reporte-hora-venta',
  templateUrl: './reporte-hora-venta.page.html',
  styleUrls: ['./reporte-hora-venta.page.scss'],
})
export class ReporteHoraVentaPage implements OnInit {
  constructor(private alertController: AlertController) { }

  ngOnInit() {
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
