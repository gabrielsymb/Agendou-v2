import { GetClientHistory } from "../domain/use-cases/GetClientHistory";
import {
  AgendamentoRepository,
  IHistoricoDB,
} from "../persistence/AgendamentoRepository";
import dayjs from "dayjs";

describe("GetClientHistory Use Case", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("happy path: returns formatted history", () => {
    const sampleDb: IHistoricoDB[] = [
      {
        id: "11111111-1111-1111-1111-111111111111",
        dataHoraInicio: dayjs.utc("2025-11-16T10:00:00Z").toISOString(),
        status: "Concluido",
        servicoNome: "Corte",
        servicoPreco: 50,
        servicoDuracaoMinutos: 30,
      },
    ];

    jest
      .spyOn(AgendamentoRepository.prototype, "getClientHistory")
      .mockReturnValue(sampleDb as any);

    const uc = new GetClientHistory();
    const result = uc.execute(
      "11111111-1111-1111-1111-111111111111",
      "22222222-2222-2222-2222-222222222222"
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      agendamentoId: sampleDb[0].id,
      data: "2025-11-16",
      hora: "10:00",
      status: "Concluido",
      servicoNome: "Corte",
      servicoPreco: 50,
      servicoDuracaoMinutos: 30,
    });
  });

  test("invalid clientId throws error", () => {
    const uc = new GetClientHistory();
    expect(() =>
      uc.execute("not-a-uuid", "22222222-2222-2222-2222-222222222222")
    ).toThrow("ID de Cliente inválido.");
  });
});
