# **🔥 Exemplo de Pipeline HL7 FHIR + Kafka + Node.js**

🚀 Pipeline FHIR + Kafka + Node.js na prática (do zero ao funcionamento real)

<img width="440" height="310" alt="Image" src="https://github.com/user-attachments/assets/6ca54fc7-e8d4-4887-8cbb-1bd3572955b2" />

Nos últimos dias montei um fluxo completo de integração focado em interoperabilidade em saúde — **saindo do dado bruto até um servidor FHIR**.

💡 O **HL7 FHIR** funciona como um grande “Lego da saúde” 🧩 — organiza dados clínicos em recursos padronizados, reutilizáveis e conectáveis, utilizando HTTP para permitir comunicação ágil entre sistemas.

## **🤔 Por que isso importa?**

Essa combinação cria um fluxo de dados em **tempo real**, onde o Kafka transporta as "peças de Lego" (FHIR) entre sistemas com alta velocidade e sem perda de informação. O Node.js atua como o motor ágil que processa e entrega esses dados prontamente para aplicativos, garantindo que decisões médicas sejam baseadas em informações atualizadas instantaneamente.

Quando combinamos FHIR + Kafka + Node.js, criamos um fluxo **assíncrono, escalável e em tempo real**:

- ⚡ **Kafka** transporta os dados com alta performance
- 🧠 **Node.js** processa e transforma rapidamente
- 🏥 **FHIR** garante padrão, semântica e interoperabilidade

## 🔗 Arquitetura construída

- 🗄️ PostgreSQL → origem dos exames
- 🌐 Node.js + Express + Axios → endpoint `/publish`
- 📡 Kafka → mensageria assíncrona
- 🔄 Consumer → processamento dos dados
- 🏥 HAPI FHIR → persistência padrão FHIR

## 📦 O que esse pipeline faz

1. Consulta exames no banco
2. Publica mensagens no Kafka
3. Consome e transforma os dados
4. Gera um **Bundle (transaction)**
5. Envia para o servidor FHIR
6. Cria automaticamente **Patient + Observation**
7. Evita duplicidade com base no CPF

## 🧠 Destaques técnicos

- 🐳 Conteinerização com Docker
- ⚡ Arquitetura desacoplada com Kafka
- 📦 Uso de **FHIR Bundle transaction**
- 🇧🇷 Compatível com padrões da RNDS
- 🧬 Uso de `meta.profile` (ex: BRResultadoExameLaboratorial)
- 🔗 Relacionamento entre recursos via `urn:uuid`

## 📊 Resultado

✔ Dados trafegando ponta a ponta

✔ Recursos persistidos em FHIR

✔ Pipeline assíncrono funcionando

✔ Base pronta para cenários reais (RNDS / produção)

## 💡 Onde isso pode ser aplicado?

- Integração LIS ↔ HIS
- Envio de exames laboratoriais
- Plataformas de interoperabilidade em saúde
- Ecossistemas digitais (RNDS, apps, hubs clínicos)

## 🚀 Próximos passos

👉 Evoluir para múltiplos exames por laudo (ex: **DiagnosticReport**)

👉 Aplicar validação de profiles RNDS

👉 Implementar autenticação (token)

👉 Versionamento e governança clínica

👉 Implementation Guides (IGs) 

👉 NestJS

## 🧠 Mais detalhes técnicos:

#### 🏗️ Contêiner

Utilizei o Docker para conteinerizar os serviços, permitindo isolamento dos componentes e consistência entre ambientes de execução.

![image.png](attachment:bb6386a7-3757-4464-ae82-694568ec3646:image.png)

#### 📄 Banco de Dados

No PostgreSQL, criei uma **estrutura simples** simulando o vínculo entre pacientes e seus exames, representando um cenário real de dados laboratoriais.

![image.png](attachment:8e3b6f54-7119-43a8-979b-e79181182de1:adc1200d-8020-435f-ac34-0ddf129bf5c1.png)

#### 🔗 Arquitetura em Camadas (clean e modular)

Organizei o projeto em camadas, separando responsabilidades:

![Sem título5.png](attachment:83883c08-c918-4111-9854-e8de31f9fa8b:Sem_ttulo5.png)

- `api/` → entrada (HTTP / Express)
- `services/` → acesso ao banco
- `kafka/` → producer + consumer
- `config/` → configurações
- `utils/` → transformação para FHIR

👉 Isso facilita manutenção, escala e evolução do projeto.

#### 👨‍💻 Codando…

### 🔹 `src/api/server.js`

Cria uma API com **Express** e expõe o endpoint `/publish`.

Busca exames no PostgreSQL e envia cada um para o Kafka.

Inicializa o servidor na porta 3000 e conecta ao banco.

![image.png](attachment:f976a567-6269-4eac-8230-e09bd33ffd4c:image.png)

### 🔹 `src/config/kafka.js`

Configura a conexão com o Kafka usando **kafkajs**.

Define `clientId` e o broker (`kafka:9092` no Docker).

Exporta a instância para ser reutilizada no producer e consumer.

![image.png](attachment:c068fff6-9dbb-4661-85db-149cd636fb12:image.png)

### 🔹 `src/kafka/consumer.js`

Consome mensagens do tópico `lab-results` no Kafka.

Transforma os dados em Bundle FHIR e envia para o HAPI via HTTP.

Executa o processamento assíncrono com tratamento de erro.

![Sem título.png](attachment:7063dcbe-cc0e-48e5-81c3-08caf6152e41:Sem_ttulo.png)

### 🔹 `src/kafka/producer.js`

Responsável por enviar mensagens para o Kafka.

Conecta ao broker e publica dados no tópico informado.

Serializa os dados em JSON antes de enviar.

![image.png](attachment:3d1e5b57-b3d0-4d94-a636-412e34bf048c:image.png)

 

### 🔹 `src/services/db.js`

Gerencia a conexão com o PostgreSQL usando `pg`.

Função `connectDB` abre a conexão com o banco.

Função `getExames` consulta a tabela `exames`.

![image.png](attachment:81f46cc4-3b34-4dcf-83ce-bb935bbcec22:image.png)

### 🔹 `src/utils/mapper.js`

Converte dados do banco em um **Bundle FHIR transaction**.

Cria recursos Patient e Observation.

Permite envio único com vínculo interno via `urn:uuid`.

![Sem título2.png](attachment:2436e9b3-6395-4400-b3d9-997a9c80bf96:36d04b6d-b9e9-447b-b43a-889aa3ce1102.png)

## 🔄 Fluxo completo da aplicação

```
[Cliente / cURL / Insomnia]
            │
            ▼
     (POST /publish)
        Express API
            │
            ▼
      PostgreSQL (exames)
            │
            ▼
   Producer (KafkaJS)
            │
            ▼
        Kafka (topic: lab-results)
            │
            ▼
      Consumer (KafkaJS)
            │
            ▼
   Mapper (toFHIRBundle)
            │
            ▼
        Axios (HTTP)
            │
            ▼
   HAPI FHIR Server (/fhir)
            │
            ▼
  Patient + Observation (persistidos)
```

## 🔄 Resultados finais

Ao executar o comando “`curl -X POST http://localhost:3000/publish"`, a API respondeu com “Dados enviados para Kafka”, conforme implementado no `server.js`. Em seguida, nos logs do Docker, foi possível observar o envio das mensagens — “Enviado para Kafka: PCR (e IGG)” — de acordo com o `producer.js`.

![image.png](attachment:36f873a0-9b93-41f9-91b4-79502f797b90:image.png)

![image.png](attachment:521512a3-431a-4b41-aedc-ad87f5f2add1:image.png)

No Insomnia, é possível realizar requisições GET para os recursos Patient e Observation separadamente, evidenciando os dados persistidos a partir de um único Bundle enviado.

![Sem título4.PNG](attachment:1dcf2959-4f8f-4ec1-844d-62c284f8c34c:Sem_ttulo4.png)

![Sem título3.png](attachment:ba2487bd-32e7-42f2-9369-424465f244de:Sem_ttulo3.png)

## 🎯 Conclusão

Podemos ver claramente que os dados trafegaram de ponta a ponta de forma **interoperável, semântica e padronizada**.

💬 Mesmo sendo um exemplo simplificado frente à complexidade do mundo real, ele mostra algo importante:

👉 **Interoperabilidade não depende só de investimento financeiro.**

👉 Depende de adoção de padrões e construção de um ecossistema integrado entre players.

---

## 🙌

Projetos como esse mostram como tecnologia pode, de fato, **aproximar sistemas e melhorar o cuidado em saúde**.

Se você trabalha com integração, saúde digital ou dados clínicos, vamos trocar ideias! 🚀

<br><br><br><br>

#FHIR #Kafka #NodeJS #Interoperabilidade #SaudeDigital #RNDS #HL7 #DataEngineering #SoftwareArchitecture
