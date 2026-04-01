# **🔥 Exemplo de Pipeline HL7 FHIR + Kafka + Node.js**

🚀 Pipeline FHIR + Kafka + Node.js na prática (do zero ao funcionamento real)

<img width="440" height="310" alt="Image" src="https://github.com/user-attachments/assets/6ca54fc7-e8d4-4887-8cbb-1bd3572955b2" />

Nos últimos dias montei um fluxo completo de integração focado em interoperabilidade em saúde — **saindo do dado bruto até um servidor FHIR**.

💡 O **HL7 FHIR**🔥 funciona como um grande “Lego da saúde” 🧩 — organiza dados clínicos em recursos padronizados, reutilizáveis e conectáveis, utilizando HTTP para permitir comunicação ágil entre sistemas.

## **🤔 Por que isso importa?**

Essa combinação cria um fluxo de dados em **tempo real**, onde o Kafka transporta as "peças de Lego" (FHIR) entre sistemas com alta velocidade e sem perda de informação. O Node.js atua como o motor ágil que processa e entrega esses dados prontamente para aplicativos, garantindo que decisões médicas sejam baseadas em informações atualizadas instantaneamente.

Quando combinamos FHIR + Kafka + Node.js, criamos um fluxo **assíncrono, escalável e em tempo real**:

- ⚡ **Kafka** transporta os dados com alta performance
- 🧠 **Node.js** processa e transforma rapidamente
- 🏥 **FHIR** garante padrão, semântica e interoperabilidade

## 🔗 Arquitetura construída

- 🗄️ PostgreSQL → origem dos exames
- 🌐 Node.js + Express → endpoint `/publish`
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
- 🇧🇷 Compatível com padrões da Rede Nacional de Dados em Saúde (RNDS)🕸
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

👉 Versionamento e governança clínica

👉 Implementation Guides (IGs) 

👉 Implementar autenticação (token)

👉 NestJS

## 🧠 Mais detalhes técnicos:

### 🏗️ Contêiner

Utilizei o Docker para conteinerizar os serviços, permitindo isolamento dos componentes e consistência entre ambientes de execução.

<img width="1270" height="642" alt="Image" src="https://github.com/user-attachments/assets/3eb998e3-be8c-4c9b-a9dd-60b9980ecbd8" />

### 📄 Banco de Dados

No PostgreSQL, criei uma **estrutura simples** simulando o vínculo entre paciente e seus exames, representando um cenário real de dados laboratoriais.

<img width="1371" height="493" alt="Image" src="https://github.com/user-attachments/assets/b56149e9-62f0-49e8-9d7b-39c516ea89e0" />

### 🔗 Arquitetura em Camadas (clean e modular)

Organizei o projeto em camadas, separando responsabilidades:

<img width="185" height="400" alt="Image" src="https://github.com/user-attachments/assets/e95ec260-a90a-4552-8f12-0d1a4543dddd" />

- `api/` → entrada (HTTP / Express)
- `services/` → acesso ao banco
- `kafka/` → producer + consumer
- `config/` → configurações
- `utils/` → transformação para FHIR

👉 Isso facilita manutenção, escala e evolução do projeto.

### 👨‍💻 Codando…

#### 🔹 `src/api/server.js`

Cria uma API com **Express** e envia o endpoint `/publish`.

Busca exames no PostgreSQL e envia cada um para o Kafka.

Inicializa o servidor na porta 3000 e conecta ao banco.

<img width="555" height="536" alt="Image" src="https://github.com/user-attachments/assets/11e829de-e6c6-42ec-bbb8-b4b94ec5fe75" />

#### 🔹 `src/config/kafka.js`

Configura a conexão com o Kafka.

Define `clientId` e o broker (`kafka:9092` no Docker).

Exporta a instância para ser reutilizada no producer e consumer.

<img width="440" height="251" alt="Image" src="https://github.com/user-attachments/assets/2e83a686-8706-419f-ba2e-bc4271948d33" />

#### 🔹 `src/kafka/consumer.js`

Consome mensagens do tópico `lab-results` no Kafka.

Transforma os dados em Bundle FHIR e envia para o HAPI via HTTP.

Executa o processamento assíncrono com tratamento de erro.

<img width="641" height="977" alt="Image" src="https://github.com/user-attachments/assets/bc890e98-9bed-4b80-a8e9-1c637d0cb617" />

#### 🔹 `src/kafka/producer.js`

Responsável por enviar mensagens para o Kafka.

Conecta ao broker e publica dados no tópico informado.

Serializa os dados em JSON antes de enviar.

<img width="575" height="428" alt="Image" src="https://github.com/user-attachments/assets/7379677d-ca1d-4a56-bd07-b61c0df0e31b" />

#### 🔹 `src/services/db.js`

Gerencia a conexão com o PostgreSQL.

Função `connectDB` abre a conexão com o banco.

Função `getExames` consulta a tabela `exames`.

<img width="515" height="540" alt="Image" src="https://github.com/user-attachments/assets/ea475ef7-5c96-4356-ba05-87a217ebf044" />

#### 🔹 `src/utils/mapper.js`

Converte dados do banco em um **Bundle FHIR transaction**.

Cria recursos Patient e Observation.

Permite envio único com vínculo interno via `urn:uuid`.

<img width="881" height="1661" alt="Image" src="https://github.com/user-attachments/assets/24f51912-2859-410b-82a6-aed9e8559ed3" />

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

<img width="683" height="33" alt="Image" src="https://github.com/user-attachments/assets/96fd41a8-eee1-419b-8c1b-9b4d521b7caa" />

<img width="683" height="102" alt="Image" src="https://github.com/user-attachments/assets/0ef96722-72e6-4ece-af7a-de3f51bd6793" />

No Insomnia, é possível realizar requisições GET para os recursos Patient e Observation separadamente, evidenciando os dados persistidos a partir de um único Bundle enviado.

<img width="1262" height="1028" alt="Image" src="https://github.com/user-attachments/assets/0932d696-41c8-4f82-b1ef-8ee7c6094bd1" />


<img width="1260" height="2084" alt="Image" src="https://github.com/user-attachments/assets/3024a069-f2ae-447b-baaf-5a169a09fff8" />

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
