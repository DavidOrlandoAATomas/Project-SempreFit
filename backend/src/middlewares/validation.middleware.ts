// backend/src/middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodObject, ZodRawShape } from "zod";

// Função auxiliar para verificar se o schema tem params
function hasParams(schema: ZodSchema): schema is ZodObject<ZodRawShape> {
  // Verificar se é um ZodObject e se tem uma propriedade 'params'
  // usando 'in' operator para evitar erro de tipo
  if (schema && typeof schema === 'object' && 'shape' in schema) {
    const obj = schema as any;
    return obj.shape && typeof obj.shape === 'object' && 'params' in obj.shape;
  }
  return false;
}

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    // Para DELETE, validar apenas params se existirem
    if (req.method === 'DELETE') {
      // Verificar se o schema tem params
      if (hasParams(schema)) {
        try {
          // @ts-ignore - Acessar params do schema de forma segura
          const paramsSchema = (schema as any).shape.params;
          if (paramsSchema) {
            const result = paramsSchema.parse(req.params);
            req.params = result;
          }
        } catch (paramError: any) {
          return res.status(400).json({
            success: false,
            error: {
              message: "Invalid parameters",
              details: paramError.errors?.map((e: any) => ({
                field: e.path.join('.'),
                message: e.message
              })) || paramError.message
            }
          });
        }
      }
      return next();
    }

    // Validar body para outros métodos
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Request body missing"
        }
      });
    }

    const result = schema.parse(req.body);
    req.body = result;
    
    next();
  } catch (err: any) {
    console.error("Validation error:", err.errors);
    
    return res.status(400).json({
      success: false,
      error: {
        message: "Validation error",
        details: err.errors?.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message
        })) || err.message
      }
    });
  }
};