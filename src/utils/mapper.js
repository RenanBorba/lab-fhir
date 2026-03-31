function toFHIRBundle(data) {
  // IDs internos para referenciar recursos dentro do Bundle
  const patientId = `urn:uuid:patient-${data.paciente_id}`;
  const obsId = `urn:uuid:obs-${data.id}`;

  // Recurso Patient
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

  // Recurso Observation (resultado do exame)
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
      reference: patientId // vínculo com Patient via uuid
    },
    effectiveDateTime: new Date().toISOString(),
    valueQuantity: {
      value: data.valor,
      unit: data.unidade,
      system: "http://unitsofmeasure.org",
      code: data.unidade
    }
  };

  // Bundle transaction: cria Patient + Observation juntos
  return {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      {
        fullUrl: patientId,
        resource: patient,
        request: {
          method: "POST",
          url: "Patient",
          // Evita duplicidade por CPF, cria apenas se não existir
          ifNoneExist: `identifier=http://www.saude.gov.br/fhir/r4/NamingSystem/cpf|${data.paciente_cpf}`
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
