import { WorkerFormComponent } from './worker-form.component';
import { WorkerModel } from '../worker.model';
import { of } from 'rxjs';

describe('WorkerFormComponent', () => {
  let fixture: WorkerFormComponent; // fixture é a classe (componente) que você está testando

  /* Dependências nescessárias para criar a instância de WorkerForm.
  * Não as instanciamos, pois não queremos testá-las (Mock).*/
  let workerServiceMock;
  let dialogServiceMock;
  let loaderServiceMock;

  // antes de cada teste dentro do bloco describe, esse código roda.
  beforeEach(() => {
    workerServiceMock = {
      submitWorker: jest.fn() // cria uma função mock
    }

    loaderServiceMock = {
      setLoaderState: jest.fn()
    }

    // cria uma nova instância da classe que estamos testando
    fixture = new WorkerFormComponent(
      workerServiceMock,
      dialogServiceMock,
      loaderServiceMock
    );
  });

  // testando ngOnInit e inicialização de variáveis. É possível criar describes um dentro do outro.
  describe('Setup Component', () => {
    describe('ngOnInit', () => {
      // cada it é um teste diferente
      it('should call generateWorkerForm with worker', () => {
        /* SETUP: declaração de variáveis */

        /* jest.spyOn é usado para observar as mudanças de algo.
        * Passamos o objeto e o método dentro dele que desejamos observar */
        const generateWorkerFormSpy = jest.spyOn(fixture, 'generateWorkerForm');
        const worker: WorkerModel = {
          id: '1',
          name: 'Laura Zitelli'
        } as WorkerModel;

        /* AÇÃO: chamada de métodos, atribuição de variáveis, etc */
        fixture.worker = worker;
        fixture.ngOnInit(); // os lifecyclehooks não são chamados automaticamente.

        /* TESTE: testa o componente em si */
        expect(generateWorkerFormSpy).toHaveBeenCalledWith(worker);
      });
    });
  });

  // método responsável por gerar o Form
  describe('generateWorkerForm', () => {
    // testamos se ele gera o form com os valores passados
    it('should generate form with passed values', () => {
      const worker: WorkerModel = {
        id: '1',
        name: 'Laura Zitelli',
        role: ['Frontend Trainee'],
        active: false
      } as WorkerModel;

      fixture.generateWorkerForm(worker);

      expect(fixture.workerForm.value).toEqual(worker);
    });

    // testamos se ele gera o form default se nenhum valor for passado
    it('should generate form with default values', () => {
      const defaultValues: WorkerModel = {
        id: expect.any(String), // como é gerado um num aleatório, esperamos qualquer coisa do tipo String
        name: null,
        role: [],
        active: true
      } as WorkerModel;

      fixture.generateWorkerForm(undefined);

      expect(fixture.workerForm.value).toEqual(defaultValues);
    });
  });

  describe('submitWorkerForm', () => {
    describe('workerForm NOT valid', () => {
      it('should NOT call submitWorker', () => {
        fixture.generateWorkerForm(undefined);

        fixture.submitWorkerForm();

        /* esperamos que workerService.submitWorker não seja chamado. Já temos o workerServiceMock,
        para chamar algum método seu, criamos mock do método antes de cada teste (linha 17) */
        expect(workerServiceMock.submitWorker).not.toHaveBeenCalled();
      });
    });

    describe('workerForm valid', () => {
      /* antes de qualquer teste dentro desse bloco precisamos que o form seja válido. Fazemos isso
      dentro de um bloco beforeEach para evitar repetição */
      beforeEach(() => {
        const worker: WorkerModel = {
          id: '1',
          name: 'Laura Zitelli',
          role: ['Frontend Trainee'],
          active: false
        } as WorkerModel;

        fixture.generateWorkerForm(worker);
      });

      it('should call submitWorker', () => {
        // usa mockReturnValue( of() ) porque é um subscribe
        workerServiceMock.submitWorker.mockReturnValue( of(true) );
        fixture.submitWorkerForm();

        expect(workerServiceMock.submitWorker).toHaveBeenCalledWith(fixture.workerForm.value);
      });

      it('should call loaderService.setLoaderState with true', () => {
        workerServiceMock.submitWorker.mockReturnValue( of(true) );
        fixture.submitWorkerForm();

        expect(loaderServiceMock.setLoaderState).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('', () => {});
  describe('', () => {});
  describe('', () => {});
});
