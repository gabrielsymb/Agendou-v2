import { ReorderAgendamentos } from "../domain/use-cases/ReorderAgendamentos";
import { AgendamentoRepository } from "../persistence/AgendamentoRepository";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

describe("ReorderAgendamentos Use Case", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("happy path: updates positions in transaction", () => {
    const ids = [
      "11111111-1111-1111-1111-111111111111",
      "22222222-2222-2222-2222-222222222222",
    ];
    const day = "2025-11-17";

    // Mock findById to return items with dataHoraInicio on the same day
    jest
      .spyOn(AgendamentoRepository.prototype, "findById")
      .mockImplementation((id: string) => {
        return {
          id,
          dataHoraInicio: dayjs.utc(`${day}T10:00:00Z`).toISOString(),
        } as any;
      });

    const startSpy = jest
      .spyOn(AgendamentoRepository.prototype, "startTransaction")
      .mockImplementation(() => {});
    const commitSpy = jest
      .spyOn(AgendamentoRepository.prototype, "commitTransaction")
      .mockImplementation(() => {});
    const updateSpy = jest
      .spyOn(AgendamentoRepository.prototype, "updatePosicao")
      .mockImplementation(() => {});

    const uc = new ReorderAgendamentos();
    uc.execute({ agendamentoIds: ids, data: day }, "prestador-1");

    expect(startSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalledTimes(2);
    expect(commitSpy).toHaveBeenCalled();
  });

  test("missing id: throws error listing missing ids", () => {
    const ids = ["33333333-3333-3333-3333-333333333333"];
    const day = "2025-11-17";

    jest
      .spyOn(AgendamentoRepository.prototype, "findById")
      .mockImplementation(() => undefined as any);

    const uc = new ReorderAgendamentos();
    expect(() =>
      uc.execute({ agendamentoIds: ids, data: day }, "prestador-1")
    ).toThrow(/não foram encontrados/);
  });

  test("mismatched day: throws error listing mismatches", () => {
    const ids = ["44444444-4444-4444-4444-444444444444"];
    const day = "2025-11-17";

    // Return an item with a different day
    jest
      .spyOn(AgendamentoRepository.prototype, "findById")
      .mockImplementation(() => {
        return {
          id: ids[0],
          dataHoraInicio: dayjs.utc("2025-11-16T10:00:00Z").toISOString(),
        } as any;
      });

    const uc = new ReorderAgendamentos();
    expect(() =>
      uc.execute({ agendamentoIds: ids, data: day }, "prestador-1")
    ).toThrow(/não pertencem ao dia/);
  });
});
