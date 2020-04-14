import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidarCamposService } from "src/app/shared/components/campos/validar-campos.service";
import { Filme } from "src/app/shared/models/filme";
import { FilmesService } from "src/app/core/filmes.service";
import { MatDialog } from "@angular/material/dialog";
import { AlertaComponent } from "src/app/shared/components/alerta/alerta.component";
import { Alerta } from "src/app/shared/models/alerta";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "dio-cadastro-filmes",
  templateUrl: "./cadastro-filmes.component.html",
  styleUrls: ["./cadastro-filmes.component.scss"],
})
export class CadastroFilmesComponent implements OnInit {
  cadastro: FormGroup;
  generos: string[];
  id: number;

  constructor(
    public validacao: ValidarCamposService,
    public dialog: MatDialog,
    private filmeService: FilmesService,
    private fb: FormBuilder,
    private router: Router,
    private ar: ActivatedRoute
  ) {}

  get f() {
    return this.cadastro.controls;
  }

  ngOnInit() {
    this.id = this.ar.snapshot.params["id"];

    if (this.id) {
      this.filmeService.visualizar(this.id).subscribe((filme: Filme) => {
        this.criarFormulario(filme);
      });
    } else {
      this.criarFormulario(this.criarFilmeDefault());
    }

    this.generos = [
      "Ação",
      "Romance",
      "Comédia",
      "Aventura",
      "Terror",
      "Ficção cientifíca",
      "Drama",
    ];
  }

  salvar(): void {
    this.cadastro.markAllAsTouched();
    if (this.cadastro.invalid) {
      return;
    }
    const filme = this.cadastro.getRawValue() as Filme;

    if (this.id) {
      this.updateMovie(filme);
    } else {
      this.saveMovie(filme);
    }
  }

  private criarFormulario(filme: Filme): void {
    this.cadastro = this.fb.group({
      titulo: [
        filme.titulo,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(256),
        ],
      ],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dtLancamento: [filme.dtLancamento, [Validators.required]],
      descricao: [filme.descricao],
      nota: [
        filme.nota,
        [Validators.required, Validators.min(0), Validators.max(10)],
      ],
      urlIMDb: [filme.urlIMDb, [Validators.minLength(10)]],
      genero: [filme.genero, [Validators.required]],
    });
  }

  private criarFilmeDefault(): Filme {
    return {
      id: null,
      titulo: null,
      dtLancamento: null,
      urlFoto: null,
      descricao: null,
      nota: null,
      urlIMDb: null,
      genero: null,
    } as Filme;
  }

  private saveMovie(filme: Filme): void {
    this.filmeService.salvar(filme).subscribe(
      () => {
        const config = {
          data: {
            btnSucesso: "Ir para listagem",
            btnCancelar: "Cadastrar um novo filme",
            corBtnCancelar: "primary",
            possuirBtnFechar: true,
          } as Alerta,
        };
        const dialogRef = this.dialog.open(AlertaComponent, config);
        dialogRef.afterClosed().subscribe((opcao: boolean) => {
          if (opcao) {
            this.router.navigateByUrl("filmes");
          } else {
            this.resetarForm();
          }
        });
      },
      () => {
        const config = {
          data: {
            titulo: "Erro ao salvar o registro!",
            descricao:
              "Não conseguimos salvar seu registro, por favor tente novamente mais tarde",
            btnSucesso: "Fechar",
            corBtnSucesso: "warn",
          } as Alerta,
        };
        this.dialog.open(AlertaComponent, config);
      }
    );
  }

  private updateMovie(filme: Filme): void {
    filme.id = this.id;
    this.filmeService.editar(filme).subscribe(
      () => {
        const config = {
          data: {
            descricao: "Seu registro foi atualizado com sucesso",
            btnSucesso: "Ir para listagem",
          } as Alerta,
        };
        const dialogRef = this.dialog.open(AlertaComponent, config);
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigateByUrl("filmes");
        });
      },
      () => {
        const config = {
          data: {
            titulo: "Erro ao editar o registro!",
            descricao:
              "Não conseguimos salvar seu registro, por favor tente novamente mais tarde",
            btnSucesso: "Fechar",
            corBtnSucesso: "warn",
          } as Alerta,
        };
        this.dialog.open(AlertaComponent, config);
      }
    );
  }

  resetarForm(): void {
    this.cadastro.reset();
  }
}
