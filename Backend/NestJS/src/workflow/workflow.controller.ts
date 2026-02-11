import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Workflow Legislativo')
@ApiBearerAuth()
@Controller('workflow')
export class WorkflowController {
    constructor(private readonly workflowService: WorkflowService) { }

    @Get(':proposituraId/state')
    @ApiOperation({ summary: 'Retorna o estado atual do workflow de uma propositura' })
    getState(@Param('proposituraId') proposituraId: string) {
        return this.workflowService.getWorkflowState(proposituraId);
    }

    @Get(':proposituraId/transitions')
    @ApiOperation({ summary: 'Lista transições disponíveis para a propositura' })
    getTransitions(@Param('proposituraId') proposituraId: string) {
        return this.workflowService.getTransicoesDisponiveis(proposituraId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':proposituraId/advance')
    @ApiOperation({ summary: 'Avança a propositura para a próxima fase do workflow' })
    advanceFase(
        @Param('proposituraId') proposituraId: string,
        @Body() body: { novaFase: string; observacao?: string }
    ) {
        return this.workflowService.avancarFase(proposituraId, body.novaFase, body.observacao);
    }
}
