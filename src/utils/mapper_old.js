// src/utils/mapper.js
function toFHIR(data) {
    // Recurso Patient
    const patient = {
        resourceType: "Patient",
        identifier: [
          {
            system: "http://www.saude.gov.br/fhir/r4/NamingSystem/cpf",
            value: data.paciente_cpf,
          },
        ],
        name: [{ text:data.paciente_nome }],
      };
    
    // Recurso Observation (resultado do exame)
    const observation = {
        resourceType: "Observation",
        status: "final",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/observation-category",
                code:"laboratory",
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: data.exame_loinc,
              display: data.exame_nome,
            },
          ],
        },
        subject: {
          reference: `Patient/${data.paciente_id}`,
        },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: {
          value:data.valor,
          unit:data.unidade,
          system: "http://unitsofmeasure.org",
          code:data.unidade,
        },
      };
    
    return { patient, observation };
    }
    
    module.exports= { toFHIR };