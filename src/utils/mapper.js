function toFHIRBundle(data) {
  const patientId = `urn:uuid:patient-${data.paciente_id}`;
  const obsId = `urn:uuid:obs-${data.id}`;

  const patient = {
    resourceType: "Patient",
    meta: {
      profile: [
        "http://www.saude.gov.br/fhir/r4/StructureDefinition/BRIndividuo"
      ]
    },
    identifier: [
      {
        system: "http://www.saude.gov.br/fhir/r4/NamingSystem/cpf",
        value: data.paciente_cpf
      }
    ],
    name: [{ text: data.paciente_nome }]
  };

  const observation = {
    resourceType: "Observation",
    meta: {
      profile: [
        "http://www.saude.gov.br/fhir/r4/StructureDefinition/BRResultadoExameLaboratorial"
      ]
    },
    status: "final",
    category: [{
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/observation-category",
        code: "laboratory"
      }]
    }],
    code: {
      coding: [{
        system: "http://loinc.org",
        code: data.exame_loinc,
        display: data.exame_nome
      }]
    },
    subject: {
      reference: patientId
    },
    effectiveDateTime: new Date().toISOString(),
    valueQuantity: {
      value: data.valor,
      unit: data.unidade,
      system: "http://unitsofmeasure.org",
      code: data.unidade
    }
  };

  return {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      {
        fullUrl: patientId,
        resource: patient,
        request: {
          method: "POST",
          url: "Patient"
        }
      },
      {
        fullUrl: obsId,
        resource: observation,
        request: {
          method: "POST",
          url: "Observation"
        }
      }
    ]
  };
}

module.exports = { toFHIRBundle };