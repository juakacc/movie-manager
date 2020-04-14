import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FilmesService } from "src/app/core/filmes.service";
import { Filme } from "src/app/shared/models/filme";
import { Alerta } from "src/app/shared/models/alerta";
import { AlertaComponent } from "src/app/shared/components/alerta/alerta.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "dio-visualizar-filme",
  templateUrl: "./visualizar-filme.component.html",
  styleUrls: ["./visualizar-filme.component.scss"],
})
export class VisualizarFilmeComponent implements OnInit {
  readonly semFoto =
    "https://www.buritama.sp.leg.br/imagens/parlamentares-2013-2016/sem-foto.jpg";
  filme: Filme;
  id: number;

  constructor(
    public dialog: MatDialog,
    private ar: ActivatedRoute,
    private router: Router,
    private filmesService: FilmesService
  ) {}

  ngOnInit() {
    this.id = this.ar.snapshot.params["id"];
    this.visualizar();
  }

  excluir(): void {
    const config = {
      data: {
        titulo: "Você tem certeza que deseja excluir?",
        descricao: "Caso tenha certeza, clique em OK",
        corBtnCancelar: "primary",
        corBtnSucesso: "warn",
        possuirBtnFechar: true,
      } as Alerta,
    };
    const dialogRef = this.dialog.open(AlertaComponent, config);
    dialogRef.afterClosed().subscribe((opcao: boolean) => {
      if (opcao) {
        this.filmesService.excluir(this.id).subscribe(() => {
          this.router.navigateByUrl("/filmes");
        });
      }
    });
  }

  editar(): void {
    this.router.navigateByUrl("/filmes/cadastro/" + this.id);
  }

  private visualizar(): void {
    this.filmesService.visualizar(this.id).subscribe((filme: Filme) => {
      this.filme = filme;
    });
  }
}
