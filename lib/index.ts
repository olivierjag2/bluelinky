import { AmericanController } from './controllers/american.controller';
import { EuropeanController } from './controllers/european.controller';
import { CanadianController } from './controllers/canadian.controller';
import SessionController from './controllers/controller';
import { EventEmitter } from 'events';
import logger from './logger';
import { BlueLinkyConfig } from './interfaces/common.interfaces';
import { REGIONS } from './constants';
import { Vehicle } from './vehicles/vehicle';

class BlueLinky extends EventEmitter {

  private controller: SessionController;
  private vehicles: Array<Vehicle> = [];

  private config: BlueLinkyConfig = {
    username: '',
    password: '',
    region: REGIONS.US,
    autoLogin: true,
    pin: '1234',
    vin: '',
    vehicleId: undefined,
    deviceUuid: '',
  }

  constructor(config: BlueLinkyConfig) {
    super();

    switch(config.region){
      case REGIONS.EU:
        this.controller = new EuropeanController(config);
        break;
      case REGIONS.US:
        this.controller = new AmericanController(config);
        break;
      case REGIONS.CA:
        this.controller = new CanadianController(config);
        break;
      default:
        throw new Error('Your region is not supported yet.');
    }

    // merge configs
    this.config = {      
      ...this.config,
      ...config,
    }

    console.log(this.config)

    if (config.autoLogin === undefined) {
      this.config.autoLogin = true;
    }

    this.onInit();
  }

  private onInit(): void {
    if(this.config.autoLogin){
      logger.info('Bluelinky is loging in automatically, to disable use autoLogin: false')
      this.login();
    }
  }

  public async login(): Promise<string> {
    const response = await this.controller.login();

    // get all cars from the controller
    this.vehicles = await this.controller.getVehicles();
    
    logger.debug(`Found ${this.vehicles.length} on the account`);

    this.emit('ready', this.vehicles);
    return response;
  }

  async getVehicles(): Promise<Array<Vehicle>> {
    return this.controller.getVehicles() || [];   
  }

  public getVehicle(): Vehicle|undefined {
    if (this.vehicles.length == 0) {
      throw new Error('No Vehicle found!');
    }
    if (this.config.vehicleId != undefined) {
      try {
        return this.vehicles.find(car => car.vehicleId === this.config.vehicleId) as Vehicle;
      } catch (err) {
        throw new Error('Vehicle not found!');
      }
    } else if (this.config.vin != undefined) {
      try {
        return this.vehicles.find(car => car.vin === this.config.vin) as Vehicle;
      } catch (err) {
        throw new Error('Vehicle not found!');
      } 
    }
    return this.vehicles[0];
  }

  public async refreshAccessToken(): Promise<string> {
    return this.controller.refreshAccessToken();
  }

  public async logout(): Promise<string> {
    return this.controller.logout();
  }

  // This is EU specific from what I know
  public async enterPin(): Promise<string|undefined> {
    if (this.controller.enterPin) {
      return this.controller.enterPin();
    }
  }
}

export default BlueLinky;
