import { Component, OnInit } from "@angular/core";
import { debounceTime } from "rxjs/operators";
import { FilmesService } from "src/app/core/filmes.service";
import { Filme } from "src/app/shared/models/filme";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ConfigParams } from "src/app/shared/models/config-params";
import { Router } from "@angular/router";

@Component({
  selector: "dio-listagem-filmes",
  templateUrl: "./listagem-filmes.component.html",
  styleUrls: ["./listagem-filmes.component.scss"],
})
export class ListagemFilmesComponent implements OnInit {
  readonly semFoto =
    "https://www.buritama.sp.leg.br/imagens/parlamentares-2013-2016/sem-foto.jpg";
  filmes: Filme[] = [];

  config: ConfigParams = {
    pagina: 0,
    limite: 4,
  };

  filtrosListagem: FormGroup;
  generos: String[];

  constructor(
    private filmesService: FilmesService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.filtrosListagem = this.fb.group({
      texto: [""],
      genero: [""],
    });

    this.filtrosListagem
      .get("texto")
      .valueChanges.pipe(debounceTime(400))
      .subscribe((val: string) => {
        this.config.pesquisa = val;
        this.resetarConsulta();
      });

    this.filtrosListagem.get("genero").valueChanges.subscribe((val: string) => {
      this.config.campo = {
        tipo: "genero",
        valor: val,
      };
      this.resetarConsulta();
    });

    this.generos = [
      "Ação",
      "Romance",
      "Comédia",
      "Aventura",
      "Terror",
      "Ficção cientifíca",
      "Drama",
    ];
    this.getFilmes();
  }

  onScroll(): void {
    this.getFilmes();
  }

  open(id: number): void {
    this.router.navigateByUrl("/filmes/" + id);
  }

  private getFilmes(): void {
    this.config.pagina++;

    this.filmesService.listar(this.config).subscribe((filmes: Filme[]) => {
      this.filmes.push(...filmes);
    });
  }

  private resetarConsulta(): void {
    this.config.pagina = 0;
    this.filmes = [];
    this.getFilmes();
  }
}
