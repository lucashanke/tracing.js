import { NextFunction, Request, Response } from "express";
import { v4 } from "uuid";
import context from "../context";

import middleware from '../middleware';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('middleware', () => {
  describe('with no args', () => {
    it('passes X-Request-ID header to response if it is defined on request', () => {
        const request: Partial<Request> = {
          get: jest.fn().mockReturnValue('aaaa-bbbb-cccc-dddd'),
        };
        const response: Partial<Response> = {
          setHeader: jest.fn(),
        };
        const next: NextFunction = () => {};
    
        middleware()(request as Request, response as Response, next);
    
        expect(response.setHeader).toHaveBeenCalledWith(
          'X-Request-ID',
          'aaaa-bbbb-cccc-dddd',
        );
      });
    
      it('generates X-Request-ID header and add to response if it is not defined on request', () => {
        (v4 as jest.Mock).mockReturnValue('eeee-ffff-gggg-hhhh');
        const request: Partial<Request> = {
          get: jest.fn().mockReturnValue(undefined),
        };
        const response: Partial<Response> = {
          setHeader: jest.fn(),
        };
        const next: NextFunction = () => {};
    
        middleware()(request as Request, response as Response, next);
    
        expect(response.setHeader).toHaveBeenCalledWith(
          'X-Request-ID',
          'eeee-ffff-gggg-hhhh',
        );
      });
    
      it('shares X-Request-ID with next callback execution', () => {
        (v4 as jest.Mock).mockReturnValue('eeee-ffff-gggg-hhhh');
        const request: Partial<Request> = {
          get: jest.fn().mockReturnValue(undefined),
        };
        const response: Partial<Response> = {
          setHeader: jest.fn(),
        };
    
        let requestId;
        const next: NextFunction = () => {
          requestId = context.getRequestId();
        };
    
        middleware()(request as Request, response as Response, next);
    
        expect(response.setHeader).toHaveBeenCalledWith(
          'X-Request-ID',
          'eeee-ffff-gggg-hhhh',
        );
        expect(requestId).toEqual('eeee-ffff-gggg-hhhh');
      });
  });

  describe('with different request id header name', () => {
    it('passes custom header to response if it is defined on request', () => {
        const request: Partial<Request> = {
          get: jest.fn().mockReturnValue('aaaa-bbbb-cccc-dddd'),
        };
        const response: Partial<Response> = {
          setHeader: jest.fn(),
        };
        const next: NextFunction = () => {};
    
        middleware('CorrelationId')(request as Request, response as Response, next);
    
        expect(response.setHeader).toHaveBeenCalledWith(
          'CorrelationId',
          'aaaa-bbbb-cccc-dddd',
        );
      });
    
      it('generates custom header and add to response if it is not defined on request', () => {
        (v4 as jest.Mock).mockReturnValue('eeee-ffff-gggg-hhhh');
        const request: Partial<Request> = {
          get: jest.fn().mockReturnValue(undefined),
        };
        const response: Partial<Response> = {
          setHeader: jest.fn(),
        };
        const next: NextFunction = () => {};
    
        middleware('CorrelationId')(request as Request, response as Response, next);
    
        expect(response.setHeader).toHaveBeenCalledWith(
          'CorrelationId',
          'eeee-ffff-gggg-hhhh',
        );
      });
    
      it('shares X-Request-ID with next callback execution', () => {
        (v4 as jest.Mock).mockReturnValue('correlation-id-eeee-ffff-gggg-hhhh');
        const request: Partial<Request> = {
          get: jest.fn().mockReturnValue(undefined),
        };
        const response: Partial<Response> = {
          setHeader: jest.fn(),
        };
    
        let correlationId;
        const next: NextFunction = () => {
          correlationId = context.getRequestId();
        };
    
        middleware('CorrelationId')(request as Request, response as Response, next);
    
        expect(response.setHeader).toHaveBeenCalledWith(
          'CorrelationId',
          'correlation-id-eeee-ffff-gggg-hhhh',
        );
        expect(correlationId).toEqual('correlation-id-eeee-ffff-gggg-hhhh');
      });
  });
  
});
