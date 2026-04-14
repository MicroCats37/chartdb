import fetch from 'node-fetch';

async function createMesaDePartes() {
  const BASE_URL = 'http://localhost:3001/api';
  const diagramId = 'mesa-de-partes-' + Date.now();
  
  const diagramData = {
    id: diagramId,
    name: 'Mesa de Partes Avanzado (DB)',
    databaseType: 'postgresql',
    tables: [
      {
        id: 't_user',
        name: 'User',
        x: 100, y: 100,
        color: '#3498db',
        createdAt: Date.now(),
        fields: [
          { id: 'f_u_id', name: 'id', type: { id: 'uuid', name: 'uuid' }, pk: true, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_u_email', name: 'email', type: { id: 'varchar', name: 'varchar' }, unique: true, nullable: false, createdAt: Date.now() },
          { id: 'f_u_name', name: 'fullName', type: { id: 'varchar', name: 'varchar' }, unique: false, nullable: false, createdAt: Date.now() }
        ]
      },
      {
        id: 't_area',
        name: 'Area',
        x: 550, y: 100,
        color: '#2ecc71',
        createdAt: Date.now(),
        fields: [
          { id: 'f_a_id', name: 'id', type: { id: 'uuid', name: 'uuid' }, pk: true, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_a_name', name: 'name', type: { id: 'varchar', name: 'varchar' }, unique: false, nullable: false, createdAt: Date.now() }
        ]
      },
      {
        id: 't_cargo',
        name: 'Cargo',
        x: 1000, y: 100,
        color: '#9b59b6',
        createdAt: Date.now(),
        fields: [
          { id: 'f_c_id', name: 'id', type: { id: 'uuid', name: 'uuid' }, pk: true, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_c_name', name: 'name', type: { id: 'varchar', name: 'varchar' }, unique: false, nullable: false, createdAt: Date.now() }
        ]
      },
      {
        id: 't_perfil',
        name: 'PerfilUsuario',
        x: 100, y: 550,
        color: '#34495e',
        createdAt: Date.now(),
        fields: [
          { id: 'f_p_uid', name: 'userId', type: { id: 'uuid', name: 'uuid' }, pk: false, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_p_aid', name: 'areaId', type: { id: 'uuid', name: 'uuid' }, pk: false, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_p_cid', name: 'cargoId', type: { id: 'uuid', name: 'uuid' }, pk: false, unique: false, nullable: false, createdAt: Date.now() }
        ]
      },
      {
        id: 't_exp',
        name: 'Expediente',
        x: 550, y: 550,
        color: '#f1c40f',
        createdAt: Date.now(),
        fields: [
          { id: 'f_e_id', name: 'id', type: { id: 'uuid', name: 'uuid' }, pk: true, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_e_num', name: 'number', type: { id: 'int', name: 'int' }, pk: false, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_e_year', name: 'year', type: { id: 'int', name: 'int' }, pk: false, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_e_desc', name: 'description', type: { id: 'text', name: 'text' }, pk: false, unique: false, nullable: false, createdAt: Date.now() }
        ]
      },
      {
        id: 't_anx',
        name: 'ArchivoAnexo',
        x: 1000, y: 550,
        color: '#e67e22',
        createdAt: Date.now(),
        fields: [
          { id: 'f_anx_id', name: 'id', type: { id: 'uuid', name: 'uuid' }, pk: true, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_anx_sol', name: 'solicitudId', type: { id: 'uuid', name: 'uuid' }, pk: false, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_anx_url', name: 'fileUrl', type: { id: 'varchar', name: 'varchar' }, pk: false, unique: false, nullable: false, createdAt: Date.now() }
        ]
      },
      {
        id: 't_sol',
        name: 'Solicitud',
        x: 100, y: 1000,
        color: '#e74c3c',
        createdAt: Date.now(),
        fields: [
          { id: 'f_s_id', name: 'id', type: { id: 'uuid', name: 'uuid' }, pk: true, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_s_exp', name: 'expedienteId', type: { id: 'uuid', name: 'uuid' }, pk: false, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_s_status', name: 'status', type: { id: 'varchar', name: 'varchar' }, pk: false, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_s_area', name: 'currentAreaId', type: { id: 'uuid', name: 'uuid' }, pk: false, unique: false, nullable: false, createdAt: Date.now() }
        ]
      },
      {
        id: 't_trn',
        name: 'Transicion',
        x: 550, y: 1000,
        color: '#1abc9c',
        createdAt: Date.now(),
        fields: [
          { id: 'f_tr_id', name: 'id', type: { id: 'uuid', name: 'uuid' }, pk: true, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_tr_sol', name: 'solicitudId', type: { id: 'uuid', name: 'uuid' }, pk: false, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_tr_from', name: 'fromStatus', type: { id: 'varchar', name: 'varchar' }, pk: false, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_tr_to', name: 'toStatus', type: { id: 'varchar', name: 'varchar' }, pk: false, unique: false, nullable: false, createdAt: Date.now() }
        ]
      },
      {
        id: 't_cmt',
        name: 'Comentario',
        x: 1000, y: 1000,
        color: '#95a5a6',
        createdAt: Date.now(),
        fields: [
          { id: 'f_cm_id', name: 'id', type: { id: 'uuid', name: 'uuid' }, pk: true, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_cm_sol', name: 'solicitudId', type: { id: 'uuid', name: 'uuid' }, pk: false, unique: false, nullable: false, createdAt: Date.now() },
          { id: 'f_cm_text', name: 'content', type: { id: 'text', name: 'text' }, pk: false, unique: false, nullable: false, createdAt: Date.now() }
        ]
      }
    ]
  };

  const res = await fetch(BASE_URL + '/diagrams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(diagramData)
  });
  
  if (res.ok) {
    console.log('Diagram created:', diagramId);
    
    // Create Relationships
    const rels = [
      { id: 'rel_p_u_'+Date.now(), diagramId, name: 'User->Perfil', sourceTableId: 't_user', targetTableId: 't_perfil', sourceFieldId: 'f_u_id', targetFieldId: 'f_p_uid', sourceCardinality: 'one', targetCardinality: 'many', createdAt: Date.now() },
      { id: 'rel_p_a_'+Date.now(), diagramId, name: 'Area->Perfil', sourceTableId: 't_area', targetTableId: 't_perfil', sourceFieldId: 'f_a_id', targetFieldId: 'f_p_aid', sourceCardinality: 'one', targetCardinality: 'many', createdAt: Date.now() },
      { id: 'rel_p_c_'+Date.now(), diagramId, name: 'Cargo->Perfil', sourceTableId: 't_cargo', targetTableId: 't_perfil', sourceFieldId: 'f_c_id', targetFieldId: 'f_p_cid', sourceCardinality: 'one', targetCardinality: 'many', createdAt: Date.now() },
      { id: 'rel_s_e_'+Date.now(), diagramId, name: 'Expediente->Solicitud', sourceTableId: 't_exp', targetTableId: 't_sol', sourceFieldId: 'f_e_id', targetFieldId: 'f_s_exp', sourceCardinality: 'one', targetCardinality: 'many', createdAt: Date.now() },
      { id: 'rel_a_s_'+Date.now(), diagramId, name: 'Solicitud->Anexo', sourceTableId: 't_sol', targetTableId: 't_anx', sourceFieldId: 'f_s_id', targetFieldId: 'f_anx_sol', sourceCardinality: 'one', targetCardinality: 'many', createdAt: Date.now() },
      { id: 'rel_t_s_'+Date.now(), diagramId, name: 'Solicitud->Transicion', sourceTableId: 't_sol', targetTableId: 't_trn', sourceFieldId: 'f_s_id', targetFieldId: 'f_tr_sol', sourceCardinality: 'one', targetCardinality: 'many', createdAt: Date.now() },
      { id: 'rel_c_s_'+Date.now(), diagramId, name: 'Solicitud->Comentario', sourceTableId: 't_sol', targetTableId: 't_cmt', sourceFieldId: 'f_s_id', targetFieldId: 'f_cm_sol', sourceCardinality: 'one', targetCardinality: 'many', createdAt: Date.now() }
    ];
    
    for (const rel of rels) {
      await fetch(BASE_URL + '/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rel)
      });
    }
    console.log('Relationships created.');
  } else {
    console.error('Failed to create diagram:', await res.text());
  }
}

createMesaDePartes().catch(console.error);
