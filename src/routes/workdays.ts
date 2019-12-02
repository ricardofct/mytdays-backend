// import { Router } from 'express';
// import * as crypto from 'crypto';

// import { authorization } from '../middleware/authorization';
// import { Invite, IInviteDoc } from '../models/Invite';
// import { sendInviteEmail, sendForgotPasswordEmail } from '../modules/send-grid';
// import { User, IUserDoc } from '../models/User';
// import { EmailTypes } from '../contants';
// import { Workday } from '../models/Workday';
// import { Worker } from '../models/Worker';
// import ErrorHelper from '../helpers/ErrorHelper';
// import { Vehicle } from '../models/Vehicle';

// export const workdaysRoutes = Router();

// workdaysRoutes.use(authorization);

// workdaysRoutes.get('/', async (req, res) => {
//     try {
//         const user: IUserDoc = req['user'];

//         const worker = await Worker.findOne({ userId: user._id, active: true });

//         if (!worker) {
//             return res.status(404).send({ error: 'Funcionário não encontrado!' })
//         }

//         const workdays = await Workday.find({ workerId: worker._id })

//         return res.status(200).send({ workdays })
//     } catch (error) {
//         return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) })
//     }
// })

// workdaysRoutes.post('/startday', async (req, res) => {
//     try {
//         const now = new Date();
//         const user: IUserDoc = req['user'];

//         const worker = await Worker.findOne({ userId: user._id, active: true });

//         if (!worker) {
//             return res.status(404).send({ error: 'Funcionário não encontrado!' })
//         }

//         const {
//             vehicleId,
//             flag,
//             euro,
//             km
//         } = req.body;

//         const workerVehicle = await WorkerVehicle.findOne({ userId: user._id, vehicleId, active: true });

//         if (!workerVehicle) {
//             return res.status(404).send({ error: 'Funcionário sem permissões de veículo!' })
//         }

//         const workday = new Workday({
//             workerId: worker._id,
//             vehicleId,
//             startDate: {
//                 startDate: now,
//                 createdAt: now,
//                 createdBy: user._id,
//                 updatedAt: now,
//                 updatedBy: user._id,
//                 flag,
//                 euro,
//                 km,
//                 date: now,
//                 justification: null
//             }
//         });

//         await workday.save();

//         return res.status(200).send()
//     } catch (error) {
//         return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) })
//     }
// })

// workdaysRoutes.post('/:id/endday', async (req, res) => {
//     try {
//         const now = new Date();
//         const {
//             flag,
//             euro,
//             km
//         } = req.body;
//         const user: IUserDoc = req['user'];
//         const workdayId = req.params['id'];

//         if (!workdayId) {
//             return res.status(400).send({ error: 'Diária em falta!' })
//         }

//         const workday = await Workday.findById(workdayId);

//         if (!workday) {
//             return res.status(400).send({ error: 'Diária inválida!' })
//         }

//         const worker = await Worker.findOne({ userId: user._id, active: true });

//         if (!worker) {
//             return res.status(404).send({ error: 'Funcionário não encontrado!' })
//         }

//         const workerVehicle = await WorkerVehicle.findOne({ workerId: worker._id, vehicleId: workday.vehicleId, active: true });

//         if (!workerVehicle) {
//             return res.status(404).send({ error: 'Funcionário sem permissões de veículo!' })
//         }

//         if (workday.workerId !== worker._id) {
//             return res.status(400).send({ error: 'Sem permissões!' })
//         }

//         workday.endDate = {
//             flag,
//             euro,
//             km,
//             date: now,
//             createdAt: now,
//             createdBy: worker.userId,
//             updatedAt: now,
//             updatedBy: worker.userId,
//             justification: null
//         }

//         workday.save();

//         return res.status(200).send()
//     } catch (error) {
//         return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) })
//     }
// })


// workdaysRoutes.put('/:id', async (req, res) => {
//     try {
//         const now = new Date();

//         const workdayId = req.params['id'];
//         if (!workdayId) {
//             return res.status(404).send({ error: 'Diária em falta!' })
//         }

//         const workday = await Workday.findById(workdayId);
//         if (!workday) {
//             return res.status(400).send({ error: 'Diária inválida!' })
//         }

//         const user: IUserDoc = req['user'];

//         const worker = await Worker.findOne({ workerId: user._id, active: true });
//         if (!worker) {
//             return res.status(404).send({ error: 'Funcionário não encontrado!' })
//         }

//         const {
//             vehicleId,
//             startDate, endDate
//         } = req.body;


//         if (vehicleId) {
//             const workerVehicle = await WorkerVehicle.findOne({ workerId: worker._id, vehicleId, active: true });
//             if (!workerVehicle) {
//                 return res.status(404).send({ error: 'Funcionário sem permissões de veículo!' })
//             }

//             workday.vehicleId = vehicleId;
//         }

//         if (startDate) {
//             if (startDate.km) {
//                 workday.startDate.km = startDate.km;
//             }
//             if (startDate.euro) {
//                 workday.startDate.euro = startDate.euro;
//             }
//             if (startDate.flag) {
//                 workday.startDate.flag = startDate.flag;
//             }
//             workday.startDate.updatedAt = now;
//             workday.startDate.updatedBy = worker._id;
//         }

//         if (endDate) {
//             if (endDate.km) {
//                 workday.endDate.km = endDate.km;
//             }
//             if (endDate.euro) {
//                 workday.endDate.euro = endDate.euro;
//             }
//             if (endDate.flag) {
//                 workday.endDate.flag = endDate.flag;
//             }
//             workday.endDate.updatedAt = now;
//             workday.endDate.updatedBy = worker.userId;
//         }

//         await workday.save();

//         return res.status(200).send()
//     } catch (error) {
//         return res.status(400).send({ error: ErrorHelper.getErrorMessage(error) })
//     }
// })
