import { NextResponse } from 'next/server'
import { paymentOperations } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const loanId = searchParams.get('loanId')
    const paymentId = searchParams.get('id')

    if (paymentId) {
      const payment = await paymentOperations.getPaymentById(paymentId)
      return NextResponse.json(payment)
    }

    if (loanId) {
      const payments = await paymentOperations.getPaymentsByLoanId(loanId)
      return NextResponse.json(payments)
    }

    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payment = await paymentOperations.createPayment(body)
    return NextResponse.json(payment)
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing payment ID' }, { status: 400 })
    }

    const body = await request.json()
    const updatedPayment = await paymentOperations.updatePayment(id, body)
    return NextResponse.json(updatedPayment)
  } catch (error) {
    console.error('Error updating payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing payment ID' }, { status: 400 })
    }

    await paymentOperations.deletePayment(id)
    return NextResponse.json({ message: 'Payment deleted successfully' })
  } catch (error) {
    console.error('Error deleting payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 