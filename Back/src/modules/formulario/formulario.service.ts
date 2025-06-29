import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';
import { formulario } from './entities/formulario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FormularioService {
  constructor(
    @InjectRepository(formulario)
    //@Inject('CATEGORIA_REPOSITORY')
    private readonly formularioRepository: Repository<formulario>,
  ) {}

  // Crear una nueva categoría
  async create(createFormularioDto: CreateFormularioDto) {
    //console.log('Recivido para crear formulario:', createFormularioDto);
    const formularioEntity = new formulario();

    // Fecha en formato válido
    const Fecha = new Date(createFormularioDto.fecha);
    formularioEntity.fecha = !isNaN(Fecha.getTime()) ? Fecha : new Date();

    // Asignación de campos
    formularioEntity.horaIngreso = createFormularioDto.horaIngreso;
    formularioEntity.horaSalida  = createFormularioDto.horaSalida;
    formularioEntity.area = createFormularioDto.area;
    formularioEntity.marca = createFormularioDto.marca;
    formularioEntity.modelo = createFormularioDto.modelo;
    formularioEntity.serie = createFormularioDto.serie;
    formularioEntity.tipo = createFormularioDto.tipo;
    formularioEntity.capacidad = createFormularioDto.capacidad;
    formularioEntity.refrig = createFormularioDto.refrig;
    formularioEntity.psi = createFormularioDto.psi;
    formularioEntity.volts = createFormularioDto.volts;
    formularioEntity.amp = createFormularioDto.amp;

    formularioEntity.descripcion = createFormularioDto.descripcion;

    // Asegurarse que la cantidad sea un número positivo
    const cantidad = Number(createFormularioDto.cantidad);
    formularioEntity.cantidad = isNaN(cantidad) || cantidad < 1 ? 0 : cantidad;
    formularioEntity.materiales = createFormularioDto.materiales;
    
    formularioEntity.recomendado = createFormularioDto.recomendado;

    return await this.formularioRepository.save(formularioEntity);
  }

  // Listar todas las categorías
  async findAll() {
    return await this.formularioRepository.find({ order: { id: 'asc' } });
  }

  // Buscar por ID
  async findOne(id: number) {
    const formulario = await this.formularioRepository.findOne({
      where: { id: id },
    });
    if (!formulario) {
      throw new Error('Categoría no encontrada');
    }
    return formulario;
  }

  async remove(id: number) {
    const formula = await this.formularioRepository.findOneBy({ id });
    if (!formula) {
      throw new BadRequestException(`formulario ${id} not found`);
    }
    await this.formularioRepository.remove(formula);
    return `formula eliminated successfully: #${id}`;
  }




  async update(id: number, updateDto: UpdateFormularioDto): Promise<formulario> {
    // 1) Buscar la entidad existente
    const formulario = await this.formularioRepository.findOne({ where: { id } });
    if (!formulario) {
      throw new BadRequestException(`formulario con id ${id} no encontrada`);
    }


    // 2) Aplicar sólo los campos que vienen en el DTO
    await this.formularioRepository.update(id, updateDto);

    // 3) Retornar la entidad ya actualizada
    return this.formularioRepository.findOne({ where: { id } });
  }

}